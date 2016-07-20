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
  context._value = value;
  context._name = name;
  context._add = _add;
  context._newCheck = newCheck.bind(this);

  var operatorContext = function() {
    return context._value;
  };
  operatorContext._value = value;
  operatorContext._add = runOperator;
  Object.setPrototypeOf(operatorContext, this.contextProto.operator);

  var priv = {};
  priv.state = new State();
  priv.stack = [];
  priv.running = null;

  var extendedContext = extendContext(context, [ _push, _pop, _assert ]);
  var extendedOperatorContext = extendContext(context, [ _push, _pop ]);

  var finish = flushAndReturn;
  return context;

  // all assertion methods call this one
  // it can also be used to run assertions without adding them globally
  // `check(arg, 'arg')._add(new Assertion(...))()`
  function _add(operationName, operationProto, args) {
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
  function _push() {
    priv.stack.push(priv.state);
    priv.state = new State();
    priv.state.operations = priv.running.children;
    finish = justReturn;
    return priv.state;
  }
  function _pop() {
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
  function _assert(condition) {
    priv.running.result = priv.state.strategy(condition, extendedContext, priv.state);
    return priv.state.result;
  }

  // private
  function run(operation, args) {
    priv.state.operations.push(operation);

    var previous = priv.running;
    priv.running = operation;
    operation.runInContext.apply(operation, args);
    priv.running = previous;
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
    return context._value;
  }
  function justReturn() {
    return context._value;
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
  var result = condition(context._value);
  state.result = state.result && result;
  return result;
}

/*
  eslint-env node
 */

