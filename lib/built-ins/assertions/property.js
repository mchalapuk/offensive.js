'use strict';

Object.getPrototypeOf = require('../../polyfill/get-prototype-of');

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../utils/getters');

var NoDSL = require('../../utils/nodsl');
var Type = require('../../utils/type');

var nodsl = { check: new NoDSL('ArgumentError').check };

module.exports = {
  // property assertions
  'property': new ParameterizedAssertion(function(context, propertyName, propertyValue) {
    nodsl.check(typeof propertyName === 'string', 'propertyName must be a string; got ', propertyName);

    context._push();
    context.is.not.Empty();
    context._resetOrFail();
    context._popWhenReady();

    this.getValue = Getters.property(propertyName);

    if (typeof propertyValue === 'undefined') {
      this.message.appendText('not undefined');
      return function PropertyIsDefined() {
        return hasProperty(context._value, propertyName);
      };
    }

    this.message.appendValue(propertyValue);
    return function PropertyHasValue() {
      return context._value[propertyName] === propertyValue;
    };
  }),
  'field': new Alias('property'),

  'method': new ParameterizedAssertion(function(context, methodName) {
    nodsl.check(typeof methodName === 'string', 'methodName must be a string; got ', methodName);

    context._push();
    context.is.not.Empty();
    context._resetOrFail();
    context._popWhenReady();

    this.getValue = Getters.property(methodName);
    this.message.appendText('a function');

    return function hasMethod() {
      return typeof context._value[methodName] === 'function';
    };
  }),

  'propertyOfType': new ParameterizedAssertion(function(context, propertyName, propertyType) {
    nodsl.check(typeof propertyName === 'string', 'propertyName must be a string; got ', propertyName);
    nodsl.check(Type.isType(propertyType), 'propertyType must be a valid type; got ', propertyType);

    context._push();
    context.is.not.Empty();
    context._resetOrFail();
    context._popWhenReady();

    this.message
      .appendText(Type.articleBefore(propertyType))
      .appendText(propertyType);
    this.getValue = Getters.property(propertyName);

    return function propertyIsOfType() {
      return typeof context._value[propertyName] === propertyType;
    };
  }),

  'propertyLessThan': new ParameterizedAssertion(function(context, propertyName, rightBounds) {
    nodsl.check(typeof propertyName === 'string', 'propertyName must be a string; got ', propertyName);
    nodsl.check(Type.isNumber(rightBounds), 'rightBounds must be a number; got ', rightBounds);

    context._push();

    context.is.not.Empty();
    context._resetOrFail();
    context.has.propertyOfType(propertyName, Type.NUMBER);
    context._resetOrFail();

    context._popWhenReady();

    this.message
      .appendText('<')
      .appendText(rightBounds);
    this.getValue = Getters.property(propertyName);

    return function propertyLessThan() {
      return context._value[propertyName] < rightBounds;
    };
  }),
  'propertyLess': new Alias('propertyLessThan'),
  'propertyLT': new Alias('propertyLessThan'),
  'fieldLessThan': new Alias('propertyLessThan'),
  'fieldLT': new Alias('propertyLessThan'),

  'propertyGreaterThan': new ParameterizedAssertion(function(context, propertyName, leftBounds) {
    nodsl.check(typeof propertyName === 'string', 'propertyName must be a string; got ', propertyName);
    nodsl.check(Type.isNumber(leftBounds), 'leftBounds must be a number; got ', leftBounds);

    context._push();

    context.is.not.Empty();
    context._resetOrFail();
    context.has.propertyOfType(propertyName, Type.NUMBER);
    context._resetOrFail();

    context._popWhenReady();

    this.message
      .appendText('>')
      .appendText(leftBounds);
    this.getValue = Getters.property(propertyName);

    return function propertyGreaterThan() {
      return context._value[propertyName] > leftBounds;
    };
  }),
  'propertyGreater': new Alias('propertyGreaterThan'),
  'propertyGT': new Alias('propertyGreaterThan'),
  'fieldGreaterThan': new Alias('propertyGreaterThan'),
  'fieldGT': new Alias('propertyGreaterThan'),

  // length assertions
  'length': new ParameterizedAssertion(function(context, requiredLength) {
    nodsl.check(typeof requiredLength === 'number',
        'requiredLength must be a number; got ', requiredLength);
    context.has.property('length', requiredLength);
  }),
  'len': new Alias('length'),
  // TODO 'lengthGT': new Alias('lengthGreaterThan'),
  // TODO 'lengthLT': new Alias('lengthLessThan'),
};

function hasProperty(object, propertyName) {
  var instance = object;
  while (instance) {
    if (instance.hasOwnProperty(propertyName)) {
      return true;
    }
    instance = Object.getPrototypeOf(instance);
  }
  return false;
}

/*
  eslint-env node
 */

