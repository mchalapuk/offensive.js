'use strict';

Object.setPrototypeOf = require('./polyfill/set-prototype-of');

var Assertion = require('./model/assertion');
var BinaryOperator = require('./model/binary-operator');
var SyntaxTreeBuilder = require('./syntax-tree-builder');
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

  var priv = {};

  var context = Object.create(this.contextProto.assertion);
  context._value = value;
  context._name = name;
  context._add = _add;
  context._newCheck = newCheck.bind(this);

  var operatorContext = function() {
    return priv.state.evaluate();
  };
  operatorContext._value = value;
  operatorContext._add = _add;
  Object.setPrototypeOf(operatorContext, this.contextProto.operator);

  var extendedContext = extendContext(context, [ _push, _pop, _assert, _reset ]);
  var extendedOperatorContext = extendContext(context, [ _push, _pop ]);

  defineReadOnly([ extendedContext, extendedOperatorContext ], {
    '_stackName': function() { return priv.state.stackName; },
    '_result': function() { return priv.state.evaluate(); },
  });

  priv.state = new State();
  priv.state.evaluate = returnTrue;
  priv.state.syntax.onEvaluateReady = flush;

  priv.stateStack = [];
  priv.running = null;

  return context;

  // all assertion methods call this one
  // it can also be used to run assertions without adding them globally
  // `check(arg, 'arg')._add(new Assertion(...))()`
  function _add(operationName, operationProto, args) {
    var impl = operationProto instanceof Assertion? addAssertion: addOperator;
    return impl(operationName, operationProto, args);
  }
  // to be used inside assertions
  function _push(stackName) {
    priv.stateStack.push(priv.state);
    priv.state = new State(stackName);
    priv.state.calls = priv.running.children;
  }
  function _pop() {
    if (!priv.state.syntax.isEvaluateReady()) {
      priv.state.syntax.onEvaluateReady = pop0;
      return;
    }
    pop0(priv.state.syntax.evaluate());
  }
  // (I wonder if there is a way to implement this without double IoC)
  function _assert(condition) {
    nodsl.check(typeof condition === 'function', 'condition must be a function; got ', condition);
    var operand = condition.bind(null, context._value);
    priv.state.syntax.addOperand(operand);
  }
  function _reset() {
    priv.state.syntax.flush();
  }

  // private

  function addAssertion(assertionName, proto, args) {
    var assertion = Object.create(proto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.children = [];

    run(assertion, [ extendedContext ].concat(assertion.args));

    return operatorContext;
  }

  function addOperator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.children = [];

    Object.defineProperty(operator, 'evaluate', {
      get: function() {
        throw new Error('.evaluate is write-only');
      },
      set: function(evaluate) {
        nodsl.check(typeof evaluate === 'function',
            '.evaluate must be a function; got ', evaluate);
        if (operator instanceof BinaryOperator) {
          priv.state.syntax.addBinaryOperator(evaluate);
        } else {
          priv.state.syntax.addUnaryOperator(evaluate);
        }
      },
    });

    run(operator, [ extendedOperatorContext ]);

    return context;
  }

  function run(operation, args) {
    priv.state.calls.push(operation);

    var previous = priv.running;
    priv.running = operation;
    operation.runInContext.apply(operation, args);
    priv.running = previous;
  }

  function pop0(evaluate) {
    priv.state = priv.stateStack.pop();
    priv.state.syntax.addOperand(evaluate);
  }

  function flush(evaluate) {
    if (!evaluate()) {
      var error = new ErrorBuilder(context)
        .addMessages(priv.state.calls)
        .build();
      throw error;
    }
    // everything so far satisfied, so not needed in error message
    priv.state.calls = [];
  }
}

// this gets pushed around alot
function State(stackName) {
  this.stackName = stackName;
  this.syntax = new SyntaxTreeBuilder();
  this.calls = [];
}
State.prototype = {
  evaluate: function() {
    return this.syntax.evaluate()();
  },
};

function defineReadOnly(contexts, propertyGetters) {
  contexts.forEach(function(context) {
    Object.keys(propertyGetters).forEach(function(key) {
      Object.defineProperty(context, key, {
        get: propertyGetters[key],
        set: readOnlySetter(key),
        enumerable: true,
      });
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

function returnTrue() {
  return function() {
    return true;
  };
}

/*
  eslint-env node
 */

