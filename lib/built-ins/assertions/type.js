'use strict';

var Assertion = require('../../model/assertion');

module.exports = {
  'aString': typeofAssertion('string'),
  'aNumber': typeofAssertion('number'),
  'aFunction': typeofAssertion('function'),
  'anObject': typeofAssertion('object'),
  'Undefined': typeofAssertion('undefined'),

  'anArray': new Assertion(function(context) {
    this.message = 'an array';

    context._push();
    context.has.property('splice', Array.prototype.splice)
      .and.has.property('forEach', Array.prototype.forEach);
    context._pop();
  }),
};

function typeofAssertion(requiredType) {
  function hasProperType(value) {
    return typeof value === requiredType;
  }
  return new Assertion(function(context) {
    this.message = getTypePrefix(requiredType) + requiredType;
    this.condition = hasProperType;
  });
}

function getTypePrefix(type) {
  return type === 'object'? 'an ': type === 'undefined'? '': 'a ';
}

/*
  eslint-env node
 */

