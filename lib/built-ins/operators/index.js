'use strict';

var UnaryOperator = require('../../model/unary-operator');
var BinaryOperator = require('../../model/binary-operator');
var Alias = require('../../model/alias');

var nodsl = require('../../utils/nodsl');

module.exports = {
  'not': new UnaryOperator(function() {
    this.message.appendText('not');

    return function applyNot(operand) {
      return !operand();
    };
  }),
  'no': new Alias('not'),
  'dont': new Alias('not'),
  'doesnt': new Alias('not'),
};

/*
  eslint-env node
 */

