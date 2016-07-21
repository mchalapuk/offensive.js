'use strict';

var Operator = require('./operator');

module.exports = UnaryOperator;

function UnaryOperator(operatorFunction) {
  var that = Object.create(UnaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

UnaryOperator.prototype = new Operator();

UnaryOperator.prototype.addToSyntax = addUnaryOperator;

function addUnaryOperator(syntax, applyFunction) {
  syntax.addUnaryOperator(applyFunction);
}

/*
  eslint-env node
 */

