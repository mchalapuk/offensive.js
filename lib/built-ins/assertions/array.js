'use strict';

var Assertion = require('../../model/assertion').default;
var AssertionWithArguments = require('../../model/assertion-with-arguments').default;
var Getters = require('../../getters').default;
var Types = require('../../utils/types');

module.exports = {
  'eachElementIs': new AssertionWithArguments(function(context, assertName, assertFunction) {
    context.newCheck(assertName, 'assertName').is.aString();
    context.newCheck(assertFunction, 'assertFunction').is.aFunction();

    context.push();
    if (!context.is.anArray.result) {
      context.pop();
      return;
    }

    context.value.forEach(function(elem, i) {
      context.add(new Assertion(function(innerContext) {
        this.getter = Getters.element(i);
        this.message = assertName;
        innerContext.assert(function elemSatisfiesAssertion() {
          return assertFunction(elem);
        });
      }));
    });
    context.pop();
  }),

  'numberElements': new AssertionWithArguments(function(context) {
    context.eachElementIs('a number', Types.isNumber);
  }),
};

/*
  eslint-env node
 */

