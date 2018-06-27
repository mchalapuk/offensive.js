'use strict';

var Assertion = require('../../model/assertion');
var ParameterizedAssertion = require('../../model/parameterized-assertion');
var Alias = require('../../model/alias');

var NoDSL = require('../../utils/nodsl');

var nodsl = { check: new NoDSL('ArgumentError').check };

module.exports = {
  'matches': new ParameterizedAssertion(function(context, regexp) {
    nodsl.check(
      typeof regexp === 'string' || regexp instanceof RegExp,
      'regexp must be an instance of RegExp or a string'
    );
    regexp = regexp instanceof RegExp
      ? regexp
      : new RegExp(regexp)
    ;
    this.message
      .appendText('matching')
      .appendText('/'+ regexp.source +'/'+ regexp.flags)
    ;
    return function hasProperType() {
      return regexp.test(context._value);
    };
  }),
  'matchesRegexp': new Alias('matches'),
  'matchesRegExp': new Alias('matches'),
  'match': new Alias('matches'),
};

