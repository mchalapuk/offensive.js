'use strict';

var getters = require('../getters').default;

module.exports.default = Assertion;

// assertion classes
function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  that.done = [];
  return that;
}

Assertion.prototype = {
  getter: getters.value,
  message: [],
};

/*
  eslint-env node
 */

