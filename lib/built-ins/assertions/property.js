'use strict';

Object.getPrototypeOf = require('../../polyfill/get-prototype-of');

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

module.exports = {
  // property assertions
  'property': new ParameterizedAssertion(function(context, propertyName, propertyValue) {
    context._newCheck(propertyName, 'propertyName').is.aString();

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();

    this.getter = Getters.property(propertyName);
    if (typeof propertyValue !== 'undefined') {
      this.message.appendValue(propertyValue);
      this.condition = function PropertyHasValue(value) {
        return value[propertyName] === propertyValue;
      };
    } else {
      this.message.appendString('not undefined');
      this.condition = function PropertyIsDefined(value) {
        return hasProperty(value, propertyName);
      };
    }
    context._pop();
  }),
  'field': new Alias('property'),

  'method': new ParameterizedAssertion(function(context, methodName) {
    context._newCheck(methodName, 'methodName').is.aString();

    context._push();
    if (!context.is.not.Empty._result) {
      context._pop();
      return;
    }

    context._reset();
    this.getter = Getters.property(methodName);
    this.message.appendString('a function');
    this.condition = hasMethod;
    context._pop();

    function hasMethod(value) {
      return typeof value[methodName] === 'function';
    }
  }),

  // length assertions
  'length': new ParameterizedAssertion(function(context, requiredLength) {
    context._newCheck(requiredLength, 'requiredLength').is.aNumber();
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

