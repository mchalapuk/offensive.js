'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'True': new Assertion(function(context) {
    this.message.appendValue(true);

    return function isTrue() {
      return context._value === true;
    };
  }),
  'true': new Alias('True'),

  'False': new Assertion(function(context) {
    this.message.appendValue(false);

    return function isFalse() {
      return context._value === false;
    };
  }),
  'false': new Alias('False'),

  'truthy': new Assertion(function(context) {
    this.message.appendText('truthy');

    return function isTruthy() {
      return Boolean(context._value);
    };
  }),
  'Thuthy': new Alias('truthy'),
  'thuethy': new Alias('truthy'),
  'Thuethy': new Alias('truthy'),

  'falsy': new Assertion(function(context) {
    this.message.appendText('falsy');

    return function isFalsy() {
      return !context._value;
    };
  }),
  'Falsy': new Alias('falsy'),
  'falsey': new Alias('falsy'),
  'Falsey': new Alias('falsy'),
};

/*
  eslint-env node
 */

