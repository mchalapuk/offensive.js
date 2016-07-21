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
    nodsl.check(typeof operand === 'function', 'BUG! operand must be a function; got ', operand);

    if (this.unary) {
      this.operands.push(this.unary.bind(null, operand));
      this.unary = null;
    } else {
      this.operands.push(operand);
    }

    if (this.binary) {
      this.operands = [ this.binary.bind(null, this.operands[0], this.operands[1]) ];
      this.binary = null;
    } else {
      nodsl.check(this.operands.length === 1, 'BUG! two operands added without binary operator!');
    }

    this.onEvaluateReady(this.evaluate());
  },

  addBinaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'BUG! binary operator must be a function; got ', operator);
    nodsl.check(this.binary === null, 'BUG! binary operator added after binary operator!');
    nodsl.check(this.operands.length === 1, 'BUG! binary operator added before operand!');
    this.binary = operator;
  },
  addUnaryOperator: function(operator) {
    nodsl.check(typeof operator === 'function',
        'BUG! unary operator must be a function; got ', operator);
    nodsl.check(this.unary === null, 'BUG! unary operator added after unary operator!');
    this.unary = operator;
  },

  evaluate: function() {
    nodsl.check(this.unary === null, 'BUG! evaluate called with unary operator not applied!');
    nodsl.check(this.binary === null, 'BUG! evaluate called with binary operator not applied!');
    nodsl.check(this.operands.length === 1, 'BUG! evaluate called without before adding any operand!');
    return this.operands[0];
  },
  flush: function() {
    nodsl.check(this.unary === null, 'BUG! flush called with unary operator not applied!');
    nodsl.check(this.binary === null, 'BUG! flush called with binary operator not applied!');
    this.operands = [];
  },
};

function noop() {
  // noop
}

/*
  eslint-env node
 */

