'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {
  'greaterThan': new ParameterizedAssertion(function(context, leftBounds) {
    context._newCheck(leftBounds, 'leftBounds').is.aNumber();

    context._push();
    if (!context.is.aNumber._result) {
      context._pop();
      return;
    }
    context._reset();

    this.message = [ '>', leftBounds ];
    this.condition = function(value) {
      return value > leftBounds;
    };
    context._pop();
  }),
  'greater': new Alias('greaterThan'),
  'gt': new Alias('greaterThan'),

  'lessThan': new ParameterizedAssertion(function(context, rightBounds) {
    context._newCheck(rightBounds, 'rightBounds').is.aNumber();

    context._push();
    if (!context.is.aNumber._result) {
      context._pop();
      return;
    }
    context._reset();

    this.message = [ '<', rightBounds ];
    this.condition = function(value) {
      return value < rightBounds;
    };
    context._pop();
  }),
  'less': new Alias('lessThan'),
  'lt': new Alias('lessThan'),
};

