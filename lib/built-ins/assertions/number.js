'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

var nodsl = require('../../utils/nodsl');

module.exports = {
  'greaterThan': new ParameterizedAssertion(function(context, leftBounds) {
    nodsl.check(typeof leftBounds === 'number', 'leftBounds must be a number; got ', leftBounds);

    context._push();
    context.is.aNumber();
    context._resetOrFail();
    context._popWhenReady();

    this.message
      .appendText('>')
      .appendValue(leftBounds);

    return function greaterThan() {
      return context._value > leftBounds;
    };
  }),
  'greater': new Alias('greaterThan'),
  'gt': new Alias('greaterThan'),

  'lessThan': new ParameterizedAssertion(function(context, rightBounds) {
    nodsl.check(typeof rightBounds === 'number', 'rightBounds must be a number; got ', rightBounds);

    context._push();
    context.is.aNumber();
    context._resetOrFail();
    context._popWhenReady();

    this.message
      .appendText('<')
      .appendValue(rightBounds);

    return function lessThan() {
      return context._value < rightBounds;
    };
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

