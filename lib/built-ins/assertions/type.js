'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

module.exports = {
  'aString': typeofAssertion('string'),
  'String': new Alias('aString'),
  'string': new Alias('aString'),
  'aNumber': typeofAssertion('number'),
  'Number': new Alias('aNumber'),
  'number': new Alias('aNumber'),
  'aFunction': typeofAssertion('function'),
  'Function': new Alias('aFunction'),
  'function': new Alias('aFunction'),
  'anObject': typeofAssertion('object'),
  'Object': new Alias('anObject'),
  'object': new Alias('anObject'),
  'Undefined': typeofAssertion('undefined'),
  'undefined': new Alias('Undefined'),

  'anArray': new Assertion(function(context) {
    this.message = 'an array';

    context._push();
    context.has.method('splice').and.method('forEach');
    context._pop();
  }),
  'Array': new Alias('anArray'),
  'array': new Alias('anArray'),

  'anInstanceOf': new ParameterizedAssertion(function(context, RequiredClass) {
    context._newCheck(RequiredClass, 'RequiredClass').is.aFunction();

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

