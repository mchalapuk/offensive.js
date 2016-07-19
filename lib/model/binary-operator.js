'use strict';

var Operator = require('./operator');

module.exports = BinaryOperator;

function BinaryOperator(operatorFunction) {
  var that = Object.create(BinaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

BinaryOperator.prototype = new Operator();

/*
  eslint-env node
 */

