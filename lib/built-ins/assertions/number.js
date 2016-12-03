'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

var nodsl = require('../../utils/nodsl');

module.exports = {
  'greaterThan': new ParameterizedAssertion(function(context, leftBounds) {
    nodsl.check(typeof leftBounds === 'number', 'leftBounds must be a number; got ', leftBounds);

    context._push();
    if (!context.is.aNumber._result) {
      context._pop();
      return;
    }
    context._reset();

    this.message
      .appendText('>')
      .appendValue(leftBounds);
    this.condition = greaterThan;

    context._pop();

    function greaterThan(value) {
      return value > leftBounds;
    }
  }),
  'greater': new Alias('greaterThan'),
  'gt': new Alias('greaterThan'),

  'lessThan': new ParameterizedAssertion(function(context, rightBounds) {
    nodsl.check(typeof rightBounds === 'number', 'rightBounds must be a number; got ', rightBounds);

    context._push();
    if (!context.is.aNumber._result) {
      context._pop();
      return;
    }
    context._reset();

    this.message
      .appendText('<')
      .appendValue(rightBounds);
    this.condition = lessThan;

    context._pop();

    function lessThan(value) {
      return value < rightBounds;
    }
  }),
  'less': new Alias('lessThan'),
  'lt': new Alias('lessThan'),

  'inRange': new ParameterizedAssertion(function(context, leftBounds, rightBounds) {
    nodsl.check(typeof leftBounds === 'number', 'leftBounds must be a number; got ', leftBounds);
    nodsl.check(typeof rightBounds === 'number', 'rightBounds must be a number; got ', rightBounds);

    this.message.appendText('in range <'+ leftBounds +', '+ rightBounds +')');

    context._push();
    context.is.greaterThan(leftBounds - 1).and.lessThan(rightBounds);
    context._pop();
  }),
  'between': new Alias('inRange'),
};

/*
  eslint-env node
 */

