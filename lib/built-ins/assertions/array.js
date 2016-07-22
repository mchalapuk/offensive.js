'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Getters = require('../../getters');

module.exports = {
  'elementIs': new ParameterizedAssertion(function(context, index, assertName, assertFunction) {
    context._newCheck(assertName, 'assertName').is.aString();
    context._newCheck(assertFunction, 'assertFunction').is.aFunction();

    this.getter = Getters.element(index);
    this.message = assertName;
    this.condition = elemSatisfiesAssertion;

    function elemSatisfiesAssertion(value) {
      return assertFunction(value[index]);
    }
  }),

  'eachElementIs': new ParameterizedAssertion(function(context, assertName, assertFunction) {
    context._newCheck(assertName, 'assertName').is.aString();
    context._newCheck(assertFunction, 'assertFunction').is.aFunction();

    context._push();
    if (!context.is.anArray() || context._value.length === 0) {
      context._pop();
      return;
    }
    context._reset();
    context._push();

    context._value.map(generateIntegers(0)).forEach(function(index) {
      if (context.elementIs(index, assertName, assertFunction)._result) {
        // we don't want satisfied assertions in error message
        context._reset();
        return;
      }
      context._pop();
      noop(context._operatorContext.and);
      context._push();
    });

    context._pop(true);
    context._pop(true);
  }),

  'onlyNumbers': new ParameterizedAssertion(function(context) {
    context.eachElementIs('a number', partial(isOfType, 'number'));
  }),
  'onlyStrings': new ParameterizedAssertion(function(context) {
    context.eachElementIs('a string', partial(isOfType, 'string'));
  }),
  'onlyObjects': new ParameterizedAssertion(function(context) {
    context.eachElementIs('an object', partial(isOfType, 'object'));
  }),
  'onlyFunctions': new ParameterizedAssertion(function(context) {
    context.eachElementIs('a function', partial(isOfType, 'function'));
  }),
  'onlyInstancesOf': new ParameterizedAssertion(function(context, Class) {
    context._newCheck(Class, 'Class').is.aFunction();
    context.eachElementIs('an instance of '+ Class.name, partial(isInstanceOf, Class));
  }),
};

function generateIntegers(startingFrom) {
  var nextValue = startingFrom;
  return function() {
    return nextValue++;
  };
}

function partial(func, arg) {
  return func.bind(null, arg);
}

function isOfType(requiredType, value) {
  return typeof value === requiredType;
}
function isInstanceOf(RequiredClass, value) {
  return value instanceof RequiredClass;
}

function noop() {
  // noop
}

/*
  eslint-env node
 */

