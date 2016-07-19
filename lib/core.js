'use strict';

Object.setPrototypeOf = require('./polyfill/set-prototype-of');

var Assertion = require('./model/assertion');
var ErrorBuilder = require('./error-builder');
var AssertionRegistry = require('./registry/assertion');
var OperatorRegistry = require('./registry/operator');

var nodsl = require('./nodsl');

module.exports = OffensiveCore;

function OffensiveCore(assertionRegistry, operatorRegistry) {
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);
  nodsl.check(operatorRegistry instanceof OperatorRegistry,
      'operatorRegistry must be an instance of OperatorRegistry; got ', operatorRegistry);

  this.contextProto = {
    assertion: assertionRegistry.contextProto,
    operator: operatorRegistry.contextProto,
  };
}

OffensiveCore.prototype = {
  newCheck: newCheck,
};

function newCheck(value, name) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

  var context = Object.create(this.contextProto.assertion);
  context.value = value;
  context.name = name;
  context.add = add;
  context.newCheck = newCheck.bind(this);

  var operatorContext = function() {
    return context.value;
  };
  operatorContext.value = value;
  operatorContext.add = runOperator;
  Object.setPrototypeOf(operatorContext, this.contextProto.operator);

  var priv = {};
  priv.state = new State();
  priv.stack = [];
  priv.current = null;

  // to be used inside assertions (for precondition checking)
  Object.defineProperty(operatorContext, 'result', {
    get: function() { return priv.state.result; },
    set: function() { throw new Error('.result is a read-only property'); },
  });

  var extendedContext = extendContext(context, [ push, pop, assert ]);
  var extendedOperatorContext = extendContext(context, [ push, pop ]);

  var finish = flushAndReturn;
  return context;

  // all assertion methods call this one
  // it can also be used to run assertions without adding them globally
  // `check(arg, 'arg').add(new Assertion(...))()`
  function add(operationName, operationProto, args) {
    var impl = operationProto instanceof Assertion? runAssertion: runOperator;
    return impl(operationName, operationProto, args);
  }
  function runAssertion(assertionName, proto, args) {
    var assertion = Object.create(proto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.children = [];
    run(assertion, [ extendedContext ].concat(assertion.args));
    return operatorContext;
  }
  function runOperator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.children = [];
    run(operator, [ extendedOperatorContext, priv.state ]);
    return context;
  }

  // to be used inside assertions
  function push() {
    priv.stack.push(priv.state);
    priv.state = new State();
    priv.state.operations = priv.current.children;
    finish = justReturn;
    return priv.state;
  }
  function pop() {
    var result = priv.state.result;
    function returnResult() {
      return result;
    }

    priv.state = priv.stack.pop();
    if (priv.stack.length === 0) {
      finish = flushAndReturn;
    }
    priv.state.strategy(returnResult, extendedContext, priv.state);
    return priv.state;
  }
  // (I wonder if there is a way to implement this without double IoC)
  function assert(condition) {
    priv.current.result = priv.state.strategy(condition, extendedContext, priv.state);
    return priv.state.result;
  }

  // private
  function run(operation, args) {
    priv.state.operations.push(operation);

    var previous = priv.current;
    priv.current = operation;
    operation.runInContext.apply(operation, args);
    priv.current = previous;
    finish();
  }
  function extendContext(proto, methods) {
    var extended = Object.create(proto);
    methods.forEach(function(method) { extended[method.name] = method; });
    return extended;
  }

  // finish functions
  function flushAndReturn() {
    if (!priv.state.result) {
      var error = new ErrorBuilder(context)
        .addMessages(priv.state.operations)
        .build();
      throw error;
    }
    // everything so far satisfied, so not needed in error message
    priv.state.operations = [];
    return context.value;
  }
  function justReturn() {
    return context.value;
  }
}

// this gets pushed around alot
function State() {
  this.operations = [];
  this.result = true;
}

State.prototype = {
  strategy: andStrategy,
};

function andStrategy(condition, context, state) {
  var result = condition(context.value);
  state.result = state.result && result;
  return result;
}

/*
  eslint-env node
 */

