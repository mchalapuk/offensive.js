'use strict';

var getters = require('../utils/getters');

module.exports = Assertion;

function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  that.getter = getters.value;
  return that;
}

/*
  eslint-env node
 */

