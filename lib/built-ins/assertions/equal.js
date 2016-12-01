'use strict';

var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {

  /* eslint-disable eqeqeq */
  'equalTo': new ParameterizedAssertion(function(context, another) {
    this.message
      .appendText('equal to')
      .appendValue(another);
    this.condition = function(value) {
      return value == another;
    };
  }),
  'EqualTo': new Alias('equalTo'),
  'equal': new Alias('equalTo'),
  'Equal': new Alias('equalTo'),
  'equals': new Alias('equalTo'),
  'Equals': new Alias('equalTo'),

  /* eslint-enable eqeqeq */
  'exactly': new ParameterizedAssertion(function(context, instance) {
    this.message.appendValue(instance);
    this.condition = function(value) {
      return value === instance;
    };
  }),
  'Exactly': new Alias('exactly'),
};

/*
  eslint-env node
 */

