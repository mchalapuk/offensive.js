'use strict';

module.exports = ExpressionStack;

function ExpressionStack() {
  var priv = {
    current: new Level('bottom'),
    stack: [],
  };

  var pub = {};
  bindMethods(pub, [push, pop, addOperand, addOperator, evaluate], priv);
  bindProperties(pub, [stackId, stackName], priv);
  return pub;
}

function push(priv, stackName) {
  priv.current = new Level(stackName);
}

function pop(priv, force) {
  if (priv.stack.length === 0) {
    throw new Error('.pop() called at the bottom of the stack');
  }
}

function addOperand(priv, operand) {
}

function addOperator(priv, operator) {
}

function evaluate(priv) {
}

function stackId(priv) {
}

function stackName(priv) {
  return priv.current.stackName;
}

// level

function Level(stackName) {
  this.stackName = stackName || "unnamed";
}

// utils

function bindMethods(pub, methods, priv) {
  methods.forEach(function(method) { pub[method.name] = method.bind(null, priv) });
}

function bindProperties(pub, getters, priv) {
  getters.forEach(function(getter) {
    Object.defineProperty(pub, getter.name, {
      get: getter.bind(null, priv),
      set: function() { throw new Error('property '+ getter.name +' is read-only'); }
    });
  });
}


/*
  eslint-env node
 */

