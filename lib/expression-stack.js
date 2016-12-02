'use strict';

var SyntaxTreeBuilder = require('./syntax-tree-builder');

module.exports = ExpressionStack;

function ExpressionStack() {
  var priv = {
    current: new Level('bottom'),
    stack: [],
  };

  var pub = {};
  bindMethods(pub, [push, pop, forcePop, popWhenReady, addOperand, addOperator, evaluate], priv);
  bindProperties(pub, [stackId, stackName], priv);
  return pub;
}

function push(priv, stackName) {
  priv.stack.push(priv.current);
  priv.current = new Level(stackName);
}

function pop(priv) {
  if (priv.stack.length === 0) {
    throw new Error('.pop() called at the bottom of the stack');
  }

  var topSyntax = priv.current.syntax;
  priv.current = priv.stack.pop();
  addOperand(priv, topSyntax.evaluate());
}

function forcePop(priv) {
  if (priv.stack.length === 0) {
    throw new Error('.forcePop() called at the bottom of the stack');
  }

  var topSyntax = priv.current.syntax;
  topSyntax.addOperand(returnTrue);
  priv.current = priv.stack.pop();
  addOperand(priv, topSyntax.evaluate());
}

function popWhenReady(priv) {
  if (priv.stack.length === 0) {
    throw new Error('.popWhenReady() called at the bottom of the stack');
  }
  var syntax = priv.current.syntax;
  if (syntax.isEvaluateReady()) {
    throw new Error('.popWhenReady called on a stack, which is ready; call .pop() instead');
  }

  syntax.onEvaluateReady = pop.bind(null, priv);
}

function addOperand(priv, operand) {
  priv.current.syntax.addOperand(operand);
}

function addOperator(priv, operator) {
}

function evaluate(priv) {
  if (priv.stack.length !== 0) {
    throw new Error('.evaluate() called not at the bottom of the stack');
  }

  return priv.current.syntax.evaluate()();
}

function stackId(priv) {
  return priv.current.stackId;
}

function stackName(priv) {
  return priv.current.stackName;
}

// level

var nextStackId = 0;

function Level(stackName) {
  this.stackId = nextStackId++;
  this.stackName = stackName || "unnamed";
  this.syntax = new SyntaxTreeBuilder();
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

function returnTrue() {
  return true;
}

/*
  eslint-env node
 */

