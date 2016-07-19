'use strict';

var AssertionWithArguments = require('../../model/assertion-with-arguments').default;
var Alias = require('../../model/alias').default;
var Getters = require('../../getters').default;
var Types = require('../../utils/types');

module.exports = {
  // property assertions
  'property': new AssertionWithArguments(function(context, propertyName, propertyValue) {
    context.check(propertyName, 'propertyName').is.aString();

    context.push();
    if (!context.is.not.Empty.result) {
      context.pop();
      return;
    }

    this.getter = Getters.property(propertyName);
    if (typeof propertyValue !== 'undefined') {
      this.message = propertyValue;
      context.assert(function PropertyHasValue(value) {
        return value[propertyName] === propertyValue;
      });
    } else {
      this.message = 'not undefined';
      context.assert(function PropertyIsDefined(value) {
        return !Types.isUndefined(value[propertyName]);
      });
    }
    context.pop();
  }),
  'prop': new Alias('property'),

  // length assertions
  'length': new AssertionWithArguments(function(context, requiredLength) {
    context.check(requiredLength, 'requiredLength').is.aNumber();
    context.has.property('length', requiredLength);
  }),
  'len': new Alias('length'),
  // TODO 'lengthGT': new Alias('lengthGreaterThan'),
  // TODO 'lengthLT': new Alias('lengthLessThan'),
};

/*
  eslint-env node
 */

