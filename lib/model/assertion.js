'use strict';

var getValues = require('../utils/getters');

module.exports = Assertion;

function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  that.getValue = getValues.value;
  return that;
}

/*
  eslint-env node
 */

