'use strict';

Object.getPrototypeOf = require('../../polyfill/get-prototype-of');

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

var nodsl = require('../../utils/nodsl');
var Type = require('../../utils/Type');

module.exports = {
  // property assertions
  'property': new ParameterizedAssertion(function(context, propertyName, propertyValue) {
    nodsl.check(typeof propertyName === 'string', 'propertyName must be a string; got ', propertyName);

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();
    context._popWhenReady();

    this.getter = Getters.property(propertyName);

    if (typeof propertyValue === 'undefined') {
      this.message.appendText('not undefined');
      return function PropertyIsDefined() {
        return hasProperty(context._value, propertyName);
      };

    } else {
      this.message.appendValue(propertyValue);
      return function PropertyHasValue() {
        return context._value[propertyName] === propertyValue;
      };
    }
  }),
  'field': new Alias('property'),

  'method': new ParameterizedAssertion(function(context, methodName) {
    nodsl.check(typeof methodName === 'string', 'methodName must be a string; got ', methodName);

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();
    context._popWhenReady();

    this.getter = Getters.property(methodName);
    this.message.appendText('a function');

    return function hasMethod() {
      return typeof context._value[methodName] === 'function';
    };
  }),

  'propertyOfType': new ParameterizedAssertion(function(context, propertyName, propertyType) {
    nodsl.check(typeof propertyName === 'string', 'propertyName must be a string; got ', propertyName);
    nodsl.check(Type.isType(propertyType), 'propertyType must be a valid type; got ', propertyType);

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }
    context._reset();
    context._popWhenReady();

    this.message
      .appendText(Type.articleBefore(propertyType))
      .appendText(propertyType);
    this.getter = Getters.property(propertyName);

    return function propertyIsOfType() {
      return typeof context._value[propertyName] === propertyType;
    }
  }),

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

