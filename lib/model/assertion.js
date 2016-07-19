'use strict';

var getters = require('../getters');

module.exports = Assertion;

function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  return that;
}

Assertion.prototype = {
  getter: getters.value,
  message: [],
};

/*
  eslint-env node
 */

