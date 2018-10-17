'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

var NoDSL = require('../../utils/nodsl');
var Type = require('../../utils/type');

var nodsl = { check: new NoDSL('ArgumentError').check };

module.exports = {

  'anInstanceOf': new ParameterizedAssertion(function(context, RequiredClass) {
    nodsl.check(typeof RequiredClass === 'function',
        'RequiredClass must be a function; got ', RequiredClass);

    if (RequiredClass.name) {
      this.message.appendText('an instance of '+ RequiredClass.name);
    } else {
      this.message.appendText('an instance of %UNNAMED_CLASS%');
    }

    return function isInstanceOf() {
      return context._value instanceof RequiredClass;
    };
  }),
  'instanceOf': new Alias('anInstanceOf'),

  'aDate': new Assertion(function(context) {
    this.message.appendText('a Date');

    context._push();
    context.is.anInstanceOf(Date);
    context._pop();
  }),
  'Date': new Alias('aDate'),
  'date': new Alias('aDate'),
};

/*
  eslint-env node
 */

