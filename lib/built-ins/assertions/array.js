'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Getters = require('../../getters');

module.exports = {
  'eachElementIs': new ParameterizedAssertion(function(context, assertName, assertFunction) {
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

  'numberElements': new ParameterizedAssertion(function(context) {
    context.eachElementIs('a number', isNumber);
  }),
};

function isNumber(value) {
  return typeof value === 'number';
}

/*
  eslint-env node
 */

