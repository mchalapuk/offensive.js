'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'True': new Assertion(function() {
    this.message = [ 'true' ];
    this.condition = function(value) {
      return value === true;
    };
  }),
  'true': new Alias('True'),

  'False': new Assertion(function() {
    this.message = [ 'false' ];

    this.condition = function(value) {
      return value === false;
    };
  }),
  'false': new Alias('False'),
};

/*
  eslint-env node
 */

