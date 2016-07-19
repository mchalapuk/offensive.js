'use strict';

var Assertion = require('./lib/classes/assertion').default;
var AssertionWithArguments = require('./lib/classes/assertion-with-arguments').default;
var Operator = require('./lib/classes/operator').default;
var BinaryOperator = require('./lib/classes/binary-operator').default;
var Alias = require('./lib/classes/alias').default;
var ErrorBuilder = require('./lib/error-builder').default;

module.exports = check;

module.exports.addAssertion = addAssertion;
module.exports.addOperator = addOperator;
module.exports.addNoop = addNoop;

// Object.setPrototypeOf polyfill
if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = function(instance, prototype) {

    /* eslint-disable no-proto */
    instance.__proto__ = prototype;

    /* eslint-enable no-proto */
  };
}

// contains all noop methods
var noopProto = {};

// registers a new assertion
function addNoop(name) {
  checkName(name);
  Object.defineProperty(noopProto, name, {
    get: returnThis,
    enumerable: true,
  });
}

function returnThis() {
  return this;
}

// contains all assertion objects
var assertionDefinitions = {};

// contains all assertion methods
var assertProto = Object.create(noopProto);

// registers a new assertion
function addAssertion(name, assertion) {
  if (assertion instanceof Alias) {
    addAssertion(name, getAliased(assertion));
    return;
  }

  checkAssertionName(name);
  checkAssertion(assertion);

  assertionDefinitions[name] = assertion;

  if (assertion instanceof AssertionWithArguments) {
    Object.defineProperty(assertProto, name, {
      value: function() { return this.add(name, assertion, [].slice.call(arguments)); },
      enumerable: true,
    });
  } else {
    Object.defineProperty(assertProto, name, {
      get: function() { return this.add(name, assertion); },
      enumerable: true,
    });
  }
}

// contains all operator objects
var operatorDefinitions = {};

// contains all operator methods
var operatorProto = Object.create(noopProto);

// registers a new assertion
function addOperator(name, operator) {
  if (operator instanceof Alias) {
    addOperator(name, getAliased(operator));
    return;
  }

  checkOperatorName(name);
  checkOperator(operator);

  operatorDefinitions[name] = operator;

  // only binary operators in operatorProto
  var proto = operator instanceof BinaryOperator? operatorProto: assertProto;

  Object.defineProperty(proto, name, {
    get: function() { return this.add(name, operator); },
    enumerable: true,
  });
}

// this must work when no assertions are added yet,
// so checks are implemented in vanilla javascript
function checkAssertionName(name) {
  checkName(name);
  if (name in assertionDefinitions) {
    throw new Error('assertion of name '+ name +' already registered');
  }
}
function checkName(name) {
  if (typeof name !== 'string') {
    throw new Error('name must be a string; got '+ name);
  }
}
function checkAssertion(assertion) {
  if (!(assertion instanceof Assertion)) {
    throw new Error('assertion must be an instance of Assertion');
  }
}
function checkOperatorName(name) {
  checkName(name);
  if (name in operatorDefinitions) {
    throw new Error('operator of name '+ name +' already registered');
  }
}
function checkOperator(operator) {
  if (!(operator instanceof Operator)) {
    throw new Error('operator must be an instance of Operator');
  }
}

function getAliased(assertion) {
  var aliased = assertionDefinitions[assertion.aliasFor];
  if (aliased) {
    return aliased;
  }
  aliased = operatorDefinitions[assertion.aliasFor];
  if (aliased) {
    return aliased;
  }
  throw new Error('no assertion assertion or operator of name '+ assertion.aliasFor +' registered');
}

var nullAssertions = require('./lib/assertions/null');
var typeAssertions = require('./lib/assertions/type');
var propertyAssertions = require('./lib/assertions/property');
var arrayAssertions = require('./lib/assertions/array');

[
  nullAssertions, typeAssertions, propertyAssertions, arrayAssertions,
]
.forEach(function(assertions) {
  Object.keys(assertions).forEach(function(name) {
    addAssertion(name, assertions[name]);
  });
});

var builtInOperators = require('./lib/operators');

Object.keys(builtInOperators).forEach(function(name) {
  addOperator(name, builtInOperators[name]);
});

var builtInNoops = require('./lib/noops');

builtInNoops.forEach(addNoop);

// exported check function
function check(value, name) {
  checkName(name);

  var context = Object.create(assertProto);
  context.value = value;
  context.name = name;
  context.add = add;
  context.check = check;

  var operatorContext = function() {
    return context.value;
  };
  operatorContext.value = value;
  operatorContext.add = runOperator;
  Object.setPrototypeOf(operatorContext, operatorProto);

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

