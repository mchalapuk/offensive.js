'use strict';

var Assertion = require('../../model/assertion');
var AssertionWithArguments = require('../../model/assertion-with-arguments');
var Getters = require('../../getters');

module.exports = {
  'eachElementIs': new AssertionWithArguments(function(context, assertName, assertFunction) {
    context._newCheck(assertName, 'assertName').is.aString();
    context._newCheck(assertFunction, 'assertFunction').is.aFunction();

    context._push();
    if (!context.is.anArray()) {
      context._pop();
      return;
    }

    context._value.forEach(function(elem, i) {
      context._add(new Assertion(function(innerContext) {
        this.getter = Getters.element(i);
        this.message = assertName;
        innerContext.assert(function elemSatisfiesAssertion() {
          return assertFunction(elem);
        });
      }));
    });
    context._pop();
  }),

  'numberElements': new AssertionWithArguments(function(context) {
    context.eachElementIs('a number', isNumber);
  }),
};

function isNumber(value) {
  return typeof value === 'number';
}

/*
  eslint-env node
 */

