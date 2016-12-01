'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'True': new Assertion(function() {
    this.message.appendValue(true);
    this.condition = isTrue;
  }),
  'true': new Alias('True'),

  'False': new Assertion(function() {
    this.message.appendValue(false);
    this.condition = isFalse;
  }),
  'false': new Alias('False'),

  'truthy': new Assertion(function() {
    this.message.appendString('truthy');
    this.condition = isTruthy;
  }),
  'Thuthy': new Alias('truthy'),
  'thuethy': new Alias('truthy'),
  'Thuethy': new Alias('truthy'),

  'falsy': new Assertion(function() {
    this.message.appendString('falsy');
    this.condition = isFalsy;
  }),
  'Falsy': new Alias('falsy'),
  'falsey': new Alias('falsy'),
  'Falsey': new Alias('falsy'),
};

function isTrue(value) {
  return value === true;
}
function isFalse(value) {
  return value === false;
}

function isTruthy(value) {
  return Boolean(value);
}
function isFalsy(value) {
  return !value;
}

/*
  eslint-env node
 */

