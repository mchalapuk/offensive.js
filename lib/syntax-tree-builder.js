'use strict';

var nodsl = require('./nodsl');

module.exports = SyntaxTreeBuilder;

function SyntaxTreeBuilder() {
  this.binary = null;
  this.unary = null;
  this.operands = [];
  this.onEvaluateReady = noop;
}

SyntaxTreeBuilder.prototype = {
  addOperand: function(operand) {
    nodsl.check(typeof operand === 'function', 'operand must be a function; got ', operand);

    if (this.unary) {
      this.operands.push(this.unary.bind(null, operand));
      this.unary = null;
    } else {
      this.operands.push(operand);
    }

    if (this.binary) {
      this.operands = [ cacheResult(this.binary.bind(null, this.operands[0], this.operands[1])) ];
      this.binary = null;
    } else {
      nodsl.check(this.operands.length === 1, 'expected binary operator; got operand');
    }

    this.onEvaluateReady(this.evaluate());
  },

  addBinaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.binary === null,
        'expected operand or unary operator after binary operator; got binary operator');
    nodsl.check(this.operands.length === 1,
        'expected operand or unary operator; got binary operator');

    this.binary = operator;
  },
  addUnaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'operator must be a function; got ', operator);
    nodsl.check(this.unary === null, 'expected operand after unary operator; got unary operator');
    this.unary = operator;
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

function cacheResult(evaluate) {
  var strategy = loader;

  function loader() {
    var result = evaluate();
    strategy = function getter() {
      return result;
    };
    return result;
  }

  return strategy;
}

/*
  eslint-env node
 */

