'use strict';

var Assertion = require('./assertion');

module.exports = TypeofAssertion;

function TypeofAssertion(requiredType) {
  function hasProperType(value) {
    return typeof value === requiredType;
  }
  var that = Object.create(Assertion.prototype);
  that.runInContext = function(context) {
    this.message = getTypePrefix(requiredType) + requiredType;
    context.assert(hasProperType);
  };
  return that;
}

TypeofAssertion.prototype = new Assertion();

function getTypePrefix(type) {
  return type === 'object'? 'an ': type === 'undefined'? '': 'a ';
}

/*
  eslint-env node
 */

