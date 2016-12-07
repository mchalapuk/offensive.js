'use strict';

var nodsl = require('../utils/nodsl');

module.exports = SyntaxTreeBuilder;

function SyntaxTreeBuilder() {
  this.binary = null;
  this.unary = null;
  this.operands = [];
  this.onEvaluateReady = noop;
}

SyntaxTreeBuilder.prototype = {
  addOperand: function(operand, maybeCallback) {
    nodsl.check(typeof operand === 'function', 'operand must be a function; got ', operand);

    var callback = maybeCallback || noop;
    nodsl.check(typeof callback === 'function', 'callback must be a function; got ', callback);

    var operandWithCallback = cacheResult(operand, callback);

    if (this.unary) {
      this.operands.push(this.unary.bind(null, operandWithCallback));
      this.unary = null;
    } else {
      this.operands.push(operandWithCallback);
    }

    if (this.binary) {
      this.operands = [ cacheResult(this.binary.bind(null, this.operands[0], this.operands[1]), noop) ];
      this.binary = null;
    } else {
      nodsl.check(this.operands.length === 1, 'expected binary operator; got operand');
    }

    this.onEvaluateReady(this.evaluate());
  },

  addBinaryOperator: function(operator, maybeCallback) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.binary === null,
        'expected operand or unary operator after binary operator; got binary operator');
    nodsl.check(this.operands.length === 1,
        'expected operand or unary operator; got binary operator');

    var callback = maybeCallback || noop;
    nodsl.check(typeof callback === 'function', 'callback must be a function; got ', callback);

    var operatorWithCallback = function(lhs, rhs) {
      var result = operator(lhs, rhs);
      callback(result);
      return result;
    };

    this.binary = operatorWithCallback;
  },
  addUnaryOperator: function(operator, maybeCallback) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.unary === null, 'expected operand after unary operator; got unary operator');

    var callback = maybeCallback || noop;
    nodsl.check(typeof callback === 'function', 'callback must be a function; got ', callback);

    var operatorWithCallback = function(rhs) {
      var result = operator(rhs);
      callback(result);
      return result;
    };

    this.unary = operatorWithCallback;
  },

  isEvaluateReady: function() {
    return this.operands.length === 1 && this.binary === null;
  },
  evaluate: function() {
    nodsl.check(this.unary === null, 'trying to evaluate with dangling unary operator');
    nodsl.check(this.binary === null, 'trying to evaluate with dangling binary operator');
    nodsl.check(this.operands.length === 1, 'trying to evaluate an empty expression');
    return this.operands[0];
  },

  flush: function() {
    nodsl.check(this.unary === null, 'trying to flush with dangling unary operator');
    nodsl.check(this.binary === null, 'trying to flush with dangling binary operator');
    this.operands = [];
  },
};

function noop() {
  // noop
}

function cacheResult(evaluate, callback) {
  var strategy = loader;
  var result = null;

  return function() {
    return strategy();
  };

  function loader() {
    strategy = getValue;
    result = evaluate();
    callback(result);
    return result;
  }
  function getValue() {
    return result;
  }
}

/*
  eslint-env node
 */

