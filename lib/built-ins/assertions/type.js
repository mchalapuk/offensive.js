'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {
  'aString': typeofAssertion('string'),
  'aNumber': typeofAssertion('number'),
  'aFunction': typeofAssertion('function'),
  'anObject': typeofAssertion('object'),
  'Undefined': typeofAssertion('undefined'),
  'undefined': new Alias('Undefined'),

  'anArray': new Assertion(function(context) {
    this.message = 'an array';

    context._push();
    context.has.property('splice', Array.prototype.splice)
      .and.has.property('forEach', Array.prototype.forEach);
    context._pop();
  }),

  'anInstanceOf': new ParameterizedAssertion(function(context, RequiredClass) {
    context._newCheck(RequiredClass, "RequiredClass").is.aFunction();

    this.message = 'an instance of '+ RequiredClass.name;
    this.condition = isInstanceOf;

    function isInstanceOf(value) {
      return value instanceof RequiredClass;
    }
  }),
  'instanceOf': new Alias('anInstanceOf'),
};

function typeofAssertion(requiredType) {
  function hasProperType(value) {
    return typeof value === requiredType;
  }
  return new Assertion(function() {
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

