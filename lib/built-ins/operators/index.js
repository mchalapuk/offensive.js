'use strict';

var UnaryOperator = require('../../model/unary-operator');
var BinaryOperator = require('../../model/binary-operator');
var Alias = require('../../model/alias');

var nodsl = require('../../utils/nodsl');

module.exports = {
  'and': new BinaryOperator(function() {
    this.message.appendText('and');

    return function applyAnd(lhs, rhs) {
      return lhs() && rhs();
    };
  }),
  'of': new Alias('and'),
  'with': new Alias('and'),

  'not': new UnaryOperator(function() {
    this.message.appendText('not');

    return function applyNot(operand) {
      return !operand();
    };
  }),
  'no': new Alias('not'),
  'dont': new Alias('not'),
  'doesnt': new Alias('not'),

  // either and or must be used in combination
  'either': new UnaryOperator(function(context) {
    context._push('either');
  }),
  'weather': new Alias('either'),

  'or': new BinaryOperator(function(context) {
    nodsl.check(context._stackName === 'either',
        '.or called without previous .either; try .either.assertionA.or.assertionB');

    context._operator('or-impl', new BinaryOperator(function() {
      this.message.appendText('or');

      return function applyOr(lhs, rhs) {
        return lhs() || rhs();
      };
    }));

    context._popWhenReady('either');
  }),
};

/*
  eslint-env node
 */

