'use strict';

var getters = require('../getters');

module.exports = Assertion;

function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  that.getter = getters.value;
  that.message = [];
  return that;
}

/*
  eslint-env node
 */

