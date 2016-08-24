'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'True': new Assertion(function() {
    this.message = [ 'true' ];
    this.condition = isTrue;
  }),
  'true': new Alias('True'),

  'False': new Assertion(function() {
    this.message = [ 'false' ];
    this.condition = isFalse;
  }),
  'false': new Alias('False'),

  'truthy': new Assertion(function() {
    this.message = [ 'truthy' ];
    this.condition = isTruethy;
  }),
  'Thuthy': new Alias('truthy'),
  'thuethy': new Alias('truthy'),
  'Thuethy': new Alias('truthy'),

  'falsy': new Assertion(function() {
    this.message = [ 'falsy' ];
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

function isTruethy(value) {
  return Boolean(value);
}
function isFalsy(value) {
  return !Boolean(value);
}

/*
  eslint-env node
 */

