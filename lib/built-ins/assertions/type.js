'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Type = require('../../utils/Type');

module.exports = {
  'ofType': new ParameterizedAssertion(function(context, requiredType) {
    context._newCheck(requiredType, 'requiredType').is.oneOf(Type.ALL);

    this.message
      .appendText(Type.articleBefore(requiredType))
      .appendText(requiredType);
    this.condition = hasProperType;

    function hasProperType(value) {
      return typeof value === requiredType;
    }
  }),
  'type': new Alias('ofType'),
  'aString': typeofAssertion('string'),
  'String': new Alias('aString'),
  'string': new Alias('aString'),
  'aNumber': typeofAssertion('number'),
  'Number': new Alias('aNumber'),
  'number': new Alias('aNumber'),
  'aBoolean': typeofAssertion('boolean'),
  'Boolean': new Alias('aBoolean'),
  'boolean': new Alias('aBoolean'),
  'aFunction': typeofAssertion('function'),
  'Function': new Alias('aFunction'),
  'function': new Alias('aFunction'),
  'anObject': typeofAssertion('object'),
  'Object': new Alias('anObject'),
  'object': new Alias('anObject'),
  'Undefined': typeofAssertion('undefined'),
  'undefined': new Alias('Undefined'),

  'anArray': new Assertion(function(context) {
    this.message.appendText('an array');

    context._push();
    context.has.method('splice').and.method('forEach');
    context._pop();
  }),
  'Array': new Alias('anArray'),
  'array': new Alias('anArray'),

  'anInstanceOf': new ParameterizedAssertion(function(context, RequiredClass) {
    context._newCheck(RequiredClass, 'RequiredClass').is.aFunction();

    if (RequiredClass.name) {
      this.message.appendText('an instance of '+ RequiredClass.name);
    } else {
      this.message.appendText('an instance of %UNNAMED_CLASS%');
    }
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
    this.message
      .appendText(Type.articleBefore(requiredType))
      .appendText(requiredType);
    this.condition = hasProperType;
  });
}

/*
  eslint-env node
 */

