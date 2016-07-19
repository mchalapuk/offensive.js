'use strict';

var Assertion = require('./assertion').default;

module.exports.default = AssertionWithArguments;

function AssertionWithArguments(assertFunction) {
  var that = Object.create(AssertionWithArguments.prototype);
  that.runInContext = assertFunction;
  return that;
}

AssertionWithArguments.prototype = new Assertion();

/*
  eslint-env node
 */

