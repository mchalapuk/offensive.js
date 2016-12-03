'use strict';

var Assertion = require('../../model/assertion');
var Alias = require('../../model/alias');

module.exports = {
  'Null': new Assertion(function(context) {
    this.message.appendValue(null);

    return function isNull() {
      return context._value === null;
    };
  }),
  'null': new Alias('Null'),
  'Nil': new Alias('Null'),
  'nil': new Alias('Nil'),
  'Empty': new Assertion(function(context) {
    this.message.appendText('empty');

    context._push();
    context.is.either.Null.or.Undefined();
    context._pop();
  }),
  'empty': new Alias('Empty'),
};

/*
  eslint-env node
 */

