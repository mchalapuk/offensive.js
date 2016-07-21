'use strict';

var UnaryOperator = require('../../model/unary-operator');
var BinaryOperator = require('../../model/binary-operator');
var Alias = require('../../model/alias');

module.exports = {
  'and': new BinaryOperator(function() {
    this.message = 'and';
    this.evaluate = applyAnd;
  }),
  'of': new Alias('and'),
  'with': new Alias('and'),

  'not': new UnaryOperator(function() {
    this.message = 'not';
    this.evaluate = applyNot;
  }),

  // either and or must be used in combination
  'either': new UnaryOperator(function(context) {
    context._push('either');
  }),
  'weather': new Alias('either'),

  'or': new BinaryOperator(function(context) {
    if (context._stackName !== 'either') {
      throw new Error('.or used without .either');
    }
    this.message = 'or';
    this.evaluate = applyOr;
    context._pop();
  }),
};

function applyAnd(lhs, rhs) {
  return lhs() && rhs();
}

function applyOr(lhs, rhs) {
  return lhs() || rhs();
}

function applyNot(operand) {
  return !operand();
}

/*
  eslint-env node
 */

