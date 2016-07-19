'use strict';

var Assertion = require('../../model/assertion').default;
var TypeofAssertion = require('../../model/typeof-assertion').default;

module.exports = {
  'aString': new TypeofAssertion('string'),
  'aNumber': new TypeofAssertion('number'),
  'aFunction': new TypeofAssertion('function'),
  'anObject': new TypeofAssertion('object'),
  'Undefined': new TypeofAssertion('undefined'),

  'anArray': new Assertion(function(context) {
    this.message = 'an array';

    context.push();
    context.has.property('splice', Array.prototype.splice)
      .and.has.property('forEach', Array.prototype.forEach);
    context.pop();
  }),
};

/*
  eslint-env node
 */

