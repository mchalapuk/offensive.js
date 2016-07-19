'use strict';

var Assertion = require('./assertion');

module.exports = AssertionWithArguments;

function AssertionWithArguments(assertFunction) {
  var that = Object.create(AssertionWithArguments.prototype);
  that.runInContext = assertFunction;
  return that;
}

AssertionWithArguments.prototype = new Assertion();

/*
  eslint-env node
 */

