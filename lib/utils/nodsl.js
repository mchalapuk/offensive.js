'use strict';

var ObjectSerializer = require('../object-serializer');

module.exports = {
  check: noDslCheck,
};

var serializer = new ObjectSerializer();

function noDslCheck(condition) {
  if (condition) {
    return;
  }
  var message = [].slice
    .call(arguments, 1)
    .map(function(arg) { return typeof arg === 'string'? arg: serializer.serializeAny(arg); })
    .join('');

  var error = new Error(message);
  throw error;
}

/*
  eslint-env node
 */

