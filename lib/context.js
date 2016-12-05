'use strict';

var ExpressionStack = require('./expression-stack');
var MessageBuilder = require('./message-builder');
var AssertionMessage = require('./model/assertion-message');

var nodsl = require('./utils/nodsl');

module.exports = Context;

/**
 * Context does not define any assertions by itself. All assertion methods are passed
 * in proto.assertion, operators methods in proto.operators.
 * Context defines a bunch of readOnly properties, all prepended with underscore in order
 * to prevent name collision with assertion methods.
 */
function Context(value, name, proto, onError) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
  nodsl.check(typeof proto === 'object', 'proto must be an object; got ', proto);
  nodsl.check(typeof proto.assertion === 'object',
      'proto.assertion must be an object; got ', proto.assertion);
  nodsl.check(typeof proto.operator === 'object',
      'proto.operator must be an object; got ', proto.operator);
  nodsl.check(typeof onError === 'function', 'onError must be a function; got ', onError);

  var priv = {};
  priv.value = value;
  priv.name = name;
  priv.proto = proto;
  priv.onError = onError || noop;
  priv.messageBuilder = new MessageBuilder();
  priv.stack = new ExpressionStack(flush.bind(null, priv));
  priv.onBeforePop = null;
  priv.currentOperation = {};
  priv.done = [];
  priv.firstChildIndex = 0;

  priv.debug = function(logString) {
//    console.log(logString);
//    console.log(priv);
//    console.log('');
    noop(logString);
  };

  priv.context = {
    assertion: createContext({}, proto.assertion),
    operator: createContext(function() { return value; }, proto.operator),
  };

  // extended context contains methods used inside assertion implementations (Extension API)
  priv.context.extended = createExtendedContext(priv.context.assertion);

  return priv.context.assertion;

  function createContext(context, contextProto) {
    Object.setPrototypeOf(context, contextProto);

    // All public properties.
    defineReadOnly(context, {
      '_value': function() { return priv.value; },
      '_name': function() { return priv.name; },
      '_result': function() { return priv.stack.result; },
      '_message': function() { return priv.messageBuilder.build(priv.context.assertion); },
    });
    // All public methods.
    bindMethods(context, [ _assert, _operator ], priv);

    return context;
  }

   // Extended context is used inside assertion implementations.
  function createExtendedContext(context) {
    var extended = Object.create(context);
    bindMethods(extended,
        [ _push, _pop, _forcePop, _popWhenReady, _reset, _resetOrFail ], priv);
    defineReadOnly(extended, {
      '_stackName': function() { return priv.stack.stackName; },
      '_operatorContext': function() { return priv.context.operator; },
    });
    return extended;
  }
}

// called by each assert method
function _assert(priv, assertionName, proto, args) {
  var assertion = Object.create(proto);
  assertion.name = assertionName;
  assertion.args = args || [];
  assertion.children = [];
  assertion.message = new AssertionMessage();

  var operand = run(priv, assertion, [ priv.context.extended ].concat(assertion.args));

  if (operand) {
    nodsl.check(typeof operand === 'function',
        'assertion must return a function or undefined; got ', operand);

    priv.stack.addOperand(operand, function(result) {
      assertion.result = result;
    });
  }

  return priv.context.operator;
}

// called by each operator method
function _operator(priv, operatorName, proto) {
  var operator = Object.create(proto);
  operator.name = operatorName;
  operator.children = [];
  operator.message = new AssertionMessage();

  var applyFunction = run(priv, operator, [ priv.context.extended ]);

  if (applyFunction) {
    nodsl.check(typeof applyFunction === 'function',
        'operator must return a function or undefined; got ', applyFunction);

    operator.addToSyntax(priv.stack, applyFunction, function(result) {
      operator.result = result;
    });
  }

  return priv.context.assertion;
}

// EXTENSION API start

function _push(priv, stackName) {
  priv.debug('push:before stackName='+ stackName);

  var previous = {
    done: priv.done,
    firstChildIndex: priv.firstChildIndex,
    onBeforePop: priv.onBeforePop,
  };

  priv.done = priv.currentOperation.children;
  priv.firstChildIndex = priv.done.length;
  priv.onBeforePop = [].forEach.bind(Object.keys(previous), function(key) {
    priv[key] = previous[key];
  });

  priv.stack.push(stackName);

  priv.debug('push:after stackName='+ stackName);
}

function _pop(priv, stackName) {
  priv.debug('pop:before stackName='+ stackName);

  priv.onBeforePop();
  priv.stack.pop(stackName);

  priv.debug('pop:after stackName='+ stackName);
}

function _forcePop(priv, stackName) {
  priv.debug('forcePop:before stackName='+ stackName);

  priv.onBeforePop();
  priv.stack.forcePop(stackName);

  priv.debug('forcePop:after stackName='+ stackName);
}

function _popWhenReady(priv, stackName) {
  priv.debug('popWhenReady:before stackName='+ stackName);

  priv.stack.popWhenReady(stackName, priv.onBeforePop);

  priv.debug('popWhenReady:after stackName='+ stackName);
}

function _reset(priv) {
  priv.debug('reset:before');

  priv.stack.flush();
  priv.done.splice(priv.firstChildIndex, priv.done.length - priv.firstChildIndex);

  priv.debug('reset:after');
}

function _resetOrFail(priv) {
  if (priv.stack.result) {
    _reset(priv);
  } else {
    throw new Fail();
  }
}

// EXTENSION API end

// private

function run(priv, operation, args) {
  priv.done.push(operation);

  var previous = priv.currentOperation;
  priv.currentOperation = operation;
  var retVal = safeRun(priv, operation, args);
  priv.currentOperation = previous;
  return retVal;
}

function safeRun(priv, operation, args) {
  var stackId = priv.stack.stackId;

  try {
    return operation.runInContext.apply(operation, args);

  } catch (e) {
    if (!(e instanceof Fail)) {
      throw e;
    }
    while (priv.stack.stackId !== stackId) {
      _pop(priv);
    }
    return null;
  }
}

function flush(priv) {
  priv.debug('flush:before');

  if (!priv.stack.result) {
    priv.messageBuilder.addAssertions(priv.done);
    priv.onError(priv.context.assertion);
  }
  priv.done = [];

  priv.debug('flush:after');
}

function defineReadOnly(instance, propertyGetters) {
  Object.keys(propertyGetters).forEach(function(key) {
    Object.defineProperty(instance, key, {
      get: propertyGetters[key],
      set: readOnlySetter(key),
      enumerable: true,
    });
  });
}

function readOnlySetter(key) {
  return function() { throw new Error(key +' is read only'); };
}

function bindMethods(pub, methods, priv) {
  methods.forEach(function(method) { pub[method.name] = method.bind(null, priv); });
}

function noop() {
  // noop
}

function Fail() {
  // noop
}

/*
  eslint-env node
 */

