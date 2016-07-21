'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Getters = require('../../getters');

module.exports = {
  // property assertions
  'property': new ParameterizedAssertion(function(context, propertyName, propertyValue) {
    context._newCheck(propertyName, 'propertyName').is.aString();

    context._push();
    if (!context.is.not.Empty()) {
      context._pop();
      return;
    }

    context._reset();

    this.getter = Getters.property(propertyName);
    if (typeof propertyValue !== 'undefined') {
      this.message = propertyValue;
      this.condition = function PropertyHasValue(value) {
        return value[propertyName] === propertyValue;
      };
    } else {
      this.message = 'not undefined';
      this.condition = function PropertyIsDefined(value) {
        return isDefined(value[propertyName]);
      };
    }
    context._pop();
  }),
  'prop': new Alias('property'),

  // length assertions
  'length': new ParameterizedAssertion(function(context, requiredLength) {
    context._newCheck(requiredLength, 'requiredLength').is.aNumber();
    context.has.property('length', requiredLength);
  }),
  'len': new Alias('length'),
  // TODO 'lengthGT': new Alias('lengthGreaterThan'),
  // TODO 'lengthLT': new Alias('lengthLessThan'),
};

function isDefined(value) {
  return typeof value !== 'undefined';
}

/*
  eslint-env node
 */

