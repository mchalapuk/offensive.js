'use strict';

var Assertion = require('./lib/model/assertion').default;
var ErrorBuilder = require('./lib/error-builder').default;

var nodsl = require('./lib/nodsl');
Object.setPrototypeOf = require('./lib/polyfill/set-prototype-of');

module.exports = check;

var assertionRegistry = require('./lib/registry/assertion');
var operatorRegistry = require('./lib/registry/operator');
var noopRegistry = require('./lib/registry/noop');

// registering built-in assertions
[
  require('./lib/built-ins/assertions/null'),
  require('./lib/built-ins/assertions/type'),
  require('./lib/built-ins/assertions/property'),
  require('./lib/built-ins/assertions/array'),
]
.forEach(function(assertions) {
  for (var name in assertions) {
    assertionRegistry.add(name, assertions[name]);
  }
});

// registering built-in operators
var operators = require('./lib/built-ins/operators');

Object.keys(operators).forEach(function(name) {
  operatorRegistry.add(name, operators[name]);
});

// registering built-in noops
require('./lib/built-ins/noops')
  .forEach(noopRegistry.add);

// exported check function
function check(value, name) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

  var context = Object.create(assertionRegistry.contextProto);
  context.value = value;
  context.name = name;
  context.add = add;
  context.check = check;

  var operatorContext = function() {
    return context.value;
  };
  operatorContext.value = value;
  operatorContext.add = runOperator;
  Object.setPrototypeOf(operatorContext, operatorRegistry.contextProto);

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
    assertion.done = [];
    run(assertion, [ extendedContext ].concat(assertion.args));
    return operatorContext;
  }
  function runOperator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.done = [];
    run(operator, [ extendedOperatorContext, priv.state ]);
    return context;
  }

  // to be used inside assertions
  function push() {
    priv.stack.push(priv.state);
    priv.state = new State();
    priv.state.done = priv.current.done;
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
    priv.state.done.push(operation);

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
        .addMessages(priv.state.done)
        .build();
      throw error;
    }
    // everything so far satisfied, so not needed in error message
    priv.state.done = [];
    return context.value;
  }
  function justReturn() {
    return context.value;
  }
}

// this gets pushed around alot
function State() {
  this.done = [];
  this.result = true;
}

State.prototype = {
  strategy: andStrategy,
};

// strategies for hangling boolean operators
function andStrategy(condition, context, state) {
  var result = condition(context.value);
  state.result = state.result && result;
  return result;
}

/*
  eslint-env node
 */

