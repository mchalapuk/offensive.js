'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'Null': new Assertion(function(context) {
    this.message = 'null';
    context._assert(isNull);
  }),
  'null': new Alias('Null'),
  'Nil': new Alias('Null'),
  'nil': new Alias('Nil'),
  'Empty': new Assertion(function(context) {
    this.message = 'empty';

    context._push();
    context.is.either.Null.or.Undefined();
    context._pop();
  }),
  'empty': new Alias('Empty'),
};

function isNull(value) {
  return value === null;
}

/*
  eslint-env node
 */

