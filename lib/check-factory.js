'use strict';

Object.setPrototypeOf = require('./polyfill/set-prototype-of');

var ExpressionStack = require('./expression-stack');
var MessageBuilder = require('./message-builder');
var AssertionRegistry = require('./registry/assertion');
var OperatorRegistry = require('./registry/operator');
var AssertionMessage = require('./model/assertion-message');

var nodsl = require('./utils/nodsl');

module.exports = CheckFactory;

function CheckFactory(assertionRegistry, operatorRegistry) {
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);
  nodsl.check(operatorRegistry instanceof OperatorRegistry,
      'operatorRegistry must be an instance of OperatorRegistry; got ', operatorRegistry);

  this.contextProto = {
    assertion: assertionRegistry.contextProto,
    operator: operatorRegistry.contextProto,
  };
}

CheckFactory.prototype = {
  newCheck: newCheck,
  onError: null,
};

function newCheck(value, name) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
  var factory = this;

  var priv = {};
  priv.stack = new ExpressionStack(flush);
  priv.onBeforePop = null;
  priv.currentOperation = {};
  priv.done = [];
  priv.firstChildIndex = 0;

  var context = Object.create(factory.contextProto.assertion);
  context._value = value;
  context._name = name;
  context._assert = _assert;
  context._operator = _operator;
  context._newCheck = newCheck.bind(factory);

  function debug(logString) {
//    console.log(logString);
//    console.log(priv);
//    console.log('');
    noop(logString);
  }

  var messageBuilder = new MessageBuilder(context);

  var operatorContext = function() {
    return value;
  };
  Object.keys(context).forEach(function(key) { operatorContext[key] = context[key]; });
  Object.setPrototypeOf(operatorContext, factory.contextProto.operator);

  var readOnlyGetters = {
    '_stackName': function() { return priv.stack.stackName; },
    '_result': function() { return priv.stack.result; },
    '_message': function() { debug('message'); return messageBuilder.build(); },
  };
  defineReadOnly(context, readOnlyGetters);
  defineReadOnly(operatorContext, readOnlyGetters);

  var extendedContext = extendContext(context,
      [ _push, _pop, _forcePop, _popWhenReady, _reset, _resetOrFail ]);
  extendedContext._operatorContext = operatorContext;

  return context;

  // called by each assert method
  function _assert(assertionName, proto, args) {
    var assertion = Object.create(proto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.children = [];
    assertion.message = new AssertionMessage();

    var operand = run(assertion, [ extendedContext ].concat(assertion.args));

    if (operand) {
      nodsl.check(typeof operand === 'function',
          'assertion must return a function or undefined; got ', operand);

      priv.stack.addOperand(operand, function(result) {
        assertion.result = result;
      });
    }

    return operatorContext;
  }

  // called by each operator method
  function _operator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.children = [];
    operator.message = new AssertionMessage();

    var applyFunction = run(operator, [ extendedContext ]);

    if (applyFunction) {
      nodsl.check(typeof applyFunction === 'function',
          'operator must return a function or undefined; got ', applyFunction);

      operator.addToSyntax(priv.stack, applyFunction, function(result) {
        operator.result = result;
      });
    }

    return context;
  }

  // to be used inside assertions

  function _push(stackName) {
    debug('push:before stackName='+ stackName);

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

    debug('push:after stackName='+ stackName);
  }
  function _pop() {
    debug('pop:before');

    priv.onBeforePop();
    priv.stack.pop();

    debug('pop:after');
  }
  function _forcePop() {
    debug('forcePop:before');

    priv.onBeforePop();
    priv.stack.forcePop();

    debug('forcePop:after');
  }
  function _popWhenReady() {
    priv.stack.popWhenReady(priv.onBeforePop);
  }
  function _reset() {
    debug('reset:before');

    priv.stack.flush();
    priv.done.splice(priv.firstChildIndex, priv.done.length - priv.firstChildIndex);

    debug('reset:after');
  }
  function _resetOrFail() {
    if (priv.stack.evaluate()()) {
      _reset();
    } else {
      throw new Fail();
    }
  }

  // private

  function run(operation, args) {
    priv.done.push(operation);

    var previous = priv.currentOperation;
    priv.currentOperation = operation;
    var retVal = safeRun(operation, args);
    priv.currentOperation = previous;
    return retVal;
  }

  function flush() {
    debug('flush:before');

    if (!priv.stack.result) {
      messageBuilder.addAssertions(priv.done);
      if (factory.onError) {
        factory.onError(context);
      }
    }
    priv.done = [];

    debug('flush:after');
  }

  function safeRun(operation, args) {
    var stackId = priv.stack.stackId;

    try {
      return operation.runInContext.apply(operation, args);

    } catch (e) {
      if (!(e instanceof Fail)) {
        throw e;
      }
      while (priv.stack.stackId !== stackId) {
        _pop();
      }
      return null;
    }
  }
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

function extendContext(proto, methods) {
  var extended = Object.create(proto);
  methods.forEach(function(method) { extended[method.name] = method; });
  return extended;
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

