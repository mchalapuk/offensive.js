'use strict';

Object.setPrototypeOf = require('./polyfill/set-prototype-of');

var SyntaxTreeBuilder = require('./syntax-tree-builder');
var ErrorBuilder = require('./error-builder');
var AssertionRegistry = require('./registry/assertion');
var OperatorRegistry = require('./registry/operator');

var nodsl = require('./nodsl');

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
};

function newCheck(value, name) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

  var priv = {};

  var context = Object.create(this.contextProto.assertion);
  context._value = value;
  context._name = name;
  context._assert = _assert;
  context._operator = _operator;
  context._newCheck = newCheck.bind(this);

  var operatorContext = function() {
    return priv.state.evaluate();
  };
  operatorContext._value = value;
  operatorContext._operator = _operator;
  Object.setPrototypeOf(operatorContext, this.contextProto.operator);

  var readOnlyGetters = {
    '_stackName': function() { return priv.state.stackName; },
    '_result': function() { return priv.state.evaluate(); },
  };
  defineReadOnly(context, readOnlyGetters);
  defineReadOnly(operatorContext, readOnlyGetters);

  var extendedContext = extendContext(context, [ _push, _pop, _reset ]);
  extendedContext._operatorContext = operatorContext;

  priv.state = new State();
  priv.state.evaluate = returnTrue;
  priv.state.syntax.onEvaluateReady = flush;

  priv.stateStack = [];
  priv.running = null;

  return context;

  // called by each assert method
  function _assert(assertionName, proto, args) {
    var assertion = Object.create(proto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.children = [];

    defineWriteOnly(assertion, {
      'condition': function(condition) {
        nodsl.check(typeof condition === 'function',
            '.condition must be a function; got ', condition);
        var operand = condition.bind(null, context._value);
        priv.state.syntax.addOperand(operand);
      },
    });

    run(assertion, [ extendedContext ].concat(assertion.args));

    return operatorContext;
  }

  // called by each operator method
  function _operator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.children = [];

    defineWriteOnly(operator, {
      'apply': function(apply) {
        nodsl.check(typeof apply === 'function',
            '.apply must be a function; got ', apply);
        operator.addToSyntax(priv.state.syntax, apply);
      },
    });

    run(operator, [ extendedContext ]);

    return context;
  }

  // to be used inside assertions

  function _push(stackName) {
    priv.stateStack.push(priv.state);
    priv.state = new State(stackName);
    priv.state.calls = priv.running.children;
  }
  function _pop(force) {
    if (!priv.state.syntax.isEvaluateReady()) {
      if (force) {
        priv.state.syntax.addOperand(returnTrue());
      } else {
        priv.state.syntax.onEvaluateReady = pop0;
        return;
      }
    }
    pop0(priv.state.syntax.evaluate());
  }
  function _reset() {
    priv.state.syntax.flush();
    priv.state.calls.splice(0, priv.state.calls.length);
  }

  // private

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
    priv.state.calls.splice(0, priv.state.calls.length);
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

function defineReadOnly(instance, propertyGetters) {
  Object.keys(propertyGetters).forEach(function(key) {
    Object.defineProperty(instance, key, {
      get: propertyGetters[key],
      set: readOnlySetter(key),
      enumerable: true,
    });
  });
}
function defineWriteOnly(instance, propertySetters) {
  Object.keys(propertySetters).forEach(function(key) {
    Object.defineProperty(instance, key, {
      get: writeOnlySetter(key),
      set: propertySetters[key],
      enumerable: true,
    });
  });
}

function readOnlySetter(key) {
  return function() { throw new Error(key +' is read only'); };
}
function writeOnlySetter(key) {
  return function() { throw new Error(key +' is write only'); };
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

