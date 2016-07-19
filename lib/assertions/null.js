'use strict';

var Assertion = require('../classes/assertion').default;
var Alias = require('../classes/alias').default;
var Types = require('../utils/types');

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

