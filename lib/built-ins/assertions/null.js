'use strict';

var Assertion = require('../../model/assertion').default;
var Alias = require('../../model/alias').default;
var Types = require('../../utils/types');

module.exports = {
  'Null': new Assertion(function(context) {
    this.message = 'null';
    context.assert(Types.isNull);
  }),
  'null': new Alias('Null'),
  'Nil': new Alias('Null'),
  'nil': new Alias('Nil'),
  'Empty': new Assertion(function(context) {
    this.message = 'empty';
    context.assert(Types.isNullOrUndefined);
  }),
  'empty': new Alias('Empty'),
};

/*
  eslint-env node
 */

