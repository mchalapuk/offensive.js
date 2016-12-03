'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

var nodsl = require('../../utils/nodsl');

module.exports = {
  'oneOf': new ParameterizedAssertion(function(context, set, name) {
    nodsl.check(typeof set.splice === 'function', 'set must be an array; got', set);
    nodsl.check(typeof name === 'string' || typeof name === 'undefined',
        'name must be a string or undefined; got', name);

    this.message.appendText('one of');
    if (name) {
      this.message.appendText(name);
    } else {
      this.message.appendValue(set);
    }

    this.condition = isContainedInSet;

    function isContainedInSet(value) {
      return set.indexOf(value) !== -1;
    }
  }),
  'elementOf': new Alias('oneOf'),
  'containedIn': new Alias('oneOf'),

  'elementThatIs': new ParameterizedAssertion(function(context, index, assertName, condition) {
    nodsl.check(typeof index === 'number', 'index must be a number; got', index);
    nodsl.check(typeof assertName === 'string', 'assertName must be a string; got ', assertName);
    nodsl.check(typeof condition === 'function' || typeof condition === 'object',
        'condition must be a function or an object; got', condition);

    var conditionFunction = null;
    if (typeof condition === 'object') {
      nodsl.check(typeof condition.isSatisfiedBy === 'function',
          'condition must be a function; got ', condtion, '; or ',
          'condition.isSatisfiedBy must be a function; got ', condition.isSatisfiedBy);
      conditionFunction = condition.isSatisfiedBy.bind(condition);
    } else {
      conditionFunction = condition;
    }

    this.getter = Getters.element(index);
    this.message.appendText(assertName);
    this.condition = elemSatisfiesCondition;

    function elemSatisfiesCondition(value) {
      return conditionFunction(value[index]);
    }
  }),
  'elementWhichIs': new Alias('elementThatIs'),

  'eachElementIs': new ParameterizedAssertion(function(context, assertName, condition) {
    nodsl.check(typeof assertName === 'string', 'assertName must be a string; got ', assertName);
    nodsl.check(typeof condition === 'function' || typeof condition === 'object',
        'condition must be a function or an object; got ', condition);

    if (typeof condition === 'object') {
      nodsl.check(typeof condition.isSatisfiedBy === 'function',
          'condition must be a function; got ', condtion, '; or ',
          'condition.isSatisfiedBy must be a function; got ', condition.isSatisfiedBy);
    }

    context._push();
    if (!context.is.anArray._result || context._value.length === 0) {
      context._pop();
      return;
    }
    context._reset();
    context._push();

    context._value.map(generateIntegers(0)).forEach(function(index) {
      if (context.elementThatIs(index, assertName, condition)._result) {
        // we don't want satisfied assertions in error message
        context._reset();
        return;
      }
      context._pop();
      noop(context._operatorContext.and);
      context._push();
    });

    context._pop(force);
    context._pop();
  }),
  'everyElementIs': new Alias('eachElementIs'),
  'allElements': new Alias('eachElementIs'),
  'onlyElements': new Alias('eachElementIs'),

  'onlyNumbers': new Assertion(function(context) {
    context.eachElementIs('a number', partial(isOfType, 'number'));
  }),
  'onlyStrings': new Assertion(function(context) {
    context.eachElementIs('a string', partial(isOfType, 'string'));
  }),
  'onlyObjects': new Assertion(function(context) {
    context.eachElementIs('an object', partial(isOfType, 'object'));
  }),
  'onlyFunctions': new Assertion(function(context) {
    context.eachElementIs('a function', partial(isOfType, 'function'));
  }),
  'onlyInstancesOf': new ParameterizedAssertion(function(context, Class) {
    nodsl.check(typeof Class === 'function', 'Class must be a function; got ', Class);
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

