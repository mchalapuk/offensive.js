'use strict';

var Assertion = require('../../model/assertion').default;
var TypeofAssertion = require('../../model/typeof-assertion').default;
var Types = require('../../utils/types');

module.exports = {
  'aString': new TypeofAssertion('string'),
  'aNumber': new TypeofAssertion('number'),
  'aFunction': new TypeofAssertion('function'),
  'anObject': new TypeofAssertion('object'),
  'Undefined': new TypeofAssertion('undefined'),

  'anArray': new Assertion(function(context) {
    this.message = 'an array';
    context.assert(Types.isArray);
  }),
};

/*
  eslint-env node
 */

