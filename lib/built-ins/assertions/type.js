'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');
var Type = require('../../utils/Type');
var nodsl = require('../../utils/nodsl');

module.exports = {
  'ofType': new ParameterizedAssertion(function(context, requiredType) {
    nodsl.check(Type.isType(requiredType), 'requiredType is a valid type');

    this.message
      .appendText(Type.articleBefore(requiredType))
      .appendText(requiredType);
    this.condition = hasProperType;

    function hasProperType(value) {
      return typeof value === requiredType;
    }
  }),
  'type': new Alias('ofType'),

  'aString': new Assertion(function(context) {
    context.is.ofType(Type.STRING);
  }),
  'String': new Alias('aString'),
  'string': new Alias('aString'),

  'aNumber': new Assertion(function(context) {
    context.is.ofType(Type.NUMBER);
  }),
  'Number': new Alias('aNumber'),
  'number': new Alias('aNumber'),

  'aBoolean': new Assertion(function(context) {
    context.is.ofType(Type.BOOLEAN);
  }),
  'Boolean': new Alias('aBoolean'),
  'boolean': new Alias('aBoolean'),

  'aFunction': new Assertion(function(context) {
    context.is.ofType(Type.FUNCTION);
  }),
  'Function': new Alias('aFunction'),
  'function': new Alias('aFunction'),

  'anObject': new Assertion(function(context) {
    context.is.ofType(Type.OBJECT);
  }),
  'Object': new Alias('anObject'),
  'object': new Alias('anObject'),

  'Undefined': new Assertion(function(context) {
    context.is.ofType(Type.UNDEFINED);
  }),
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
    nodsl.check(typeof RequiredClass === 'function',
        'RequiredClass must be a function; got ', RequiredClass);

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

/*
  eslint-env node
 */

