'use strict';

var SyntaxTreeBuilder = require('./syntax-tree-builder');
var nodsl = require('./utils/nodsl');

module.exports = ExpressionStack;

function ExpressionStack(maybeResultCallback) {
  var resultCallback = maybeResultCallback || noop;
  nodsl.check(typeof resultCallback === 'function',
      'callback must be a function; got ', resultCallback);

  var priv = {
    current: new Level('bottom', 0),
    stack: [],
    nextStackId: 1,
  };

  priv.current.syntax.onEvaluateReady = resultCallback;

  var pub = {};
  bindMethods(pub, [
      push, pop, forcePop, popWhenReady, flush,
      addOperand, addUnaryOperator, addBinaryOperator
  ], priv);
  bindProperties(pub, [stackId, stackName, result], priv);
  return pub;
}

function push(priv, stackName) {
  priv.stack.push(priv.current);
  priv.current = new Level(stackName, priv.nextStackId++);
}

function pop(priv) {
  nodsl.check(priv.stack.length !== 0, '.pop() called at the bottom of the stack');

  var topSyntax = priv.current.syntax;
  priv.current = priv.stack.pop();
  addOperand(priv, topSyntax.evaluate());
}

function forcePop(priv) {
  nodsl.check(priv.stack.length !== 0, '.forcePop() called at the bottom of the stack');

  var topSyntax = priv.current.syntax;
  topSyntax.addOperand(returnTrue);
  priv.current = priv.stack.pop();
  addOperand(priv, topSyntax.evaluate());
}

function popWhenReady(priv, maybeCallback) {
  nodsl.check(priv.stack.length !== 0, '.popWhenReady() called at the bottom of the stack');

  var syntax = priv.current.syntax;
  nodsl.check(!syntax.isEvaluateReady(),
      '.popWhenReady called on a stack, which is ready; call .pop() instead');

  var callback = maybeCallback || noop;
  nodsl.check(typeof callback === 'function', 'callback must be a function; got ', callback);

  syntax.onEvaluateReady = function() {
    callback();
    pop(priv);
  };
}

function flush(priv) {
  priv.current.syntax.flush();
}

function addOperand(priv, operand, callback) {
  priv.current.syntax.addOperand(operand, callback);
}

function addUnaryOperator(priv, operator, callback) {
  priv.current.syntax.addUnaryOperator(operator, callback);
}

function addBinaryOperator(priv, operator, callback) {
  priv.current.syntax.addBinaryOperator(operator, callback);
}

function result(priv) {
//  nodsl.check(priv.stack.length === 0, 'couldn\t fetch .result (not at the bottom of the stack)');

  return priv.current.syntax.evaluate()();
}

function stackId(priv) {
  return priv.current.stackId;
}

function stackName(priv) {
  return priv.current.stackName;
}

// level

function Level(stackName, stackId) {
  this.stackId = stackId;
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

function noop() {
  // noop
}

/*
  eslint-env node
 */

