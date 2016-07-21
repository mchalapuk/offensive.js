'use strict';

var Assertion = require('./assertion');

module.exports = ParameterizedAssertion;

function ParameterizedAssertion(assertFunction) {
  var that = Object.create(ParameterizedAssertion.prototype);
  that.runInContext = assertFunction;
  return that;
}

ParameterizedAssertion.prototype = new Assertion();

/*
  eslint-env node
 */

