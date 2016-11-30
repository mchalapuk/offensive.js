'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {
  'equalTo': new ParameterizedAssertion(function(context, another) {
    this.message = [ 'equal to', another ];
    this.condition = function(value) {
      return value == another;
    };
  }),
  'EqualTo': new Alias('equalTo'),
  'equal': new Alias('equalTo'),
  'Equal': new Alias('equalTo'),
  'equals': new Alias('equalTo'),
  'Equals': new Alias('equalTo'),

  'exactly': new ParameterizedAssertion(function(context, another) {
    this.message = [ another ];
    this.condition = function(value) {
      return value === another;
    };
  }),
  'Exactly': new Alias('exactly'),
};

/*
  eslint-env node
 */

