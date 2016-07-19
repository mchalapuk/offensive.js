'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'Null': new Assertion(function(context) {
    this.message = 'null';
    context.assert(isNull);
  }),
  'null': new Alias('Null'),
  'Nil': new Alias('Null'),
  'nil': new Alias('Nil'),
  'Empty': new Assertion(function(context) {
    this.message = 'empty';

    context.push();
    context.either.Null.or.Undefined();
    context.pop();
  }),
  'empty': new Alias('Empty'),
};

function isNull(value) {
  return value === null;
}

/*
  eslint-env node
 */

