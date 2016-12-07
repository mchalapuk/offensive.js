'use strict';

var ObjectSerializer = require('../message/object-serializer');

module.exports = NoDSL;
module.exports.check = new NoDSL().check;

function NoDSL(errorName) {
  var priv = {};
  priv.errorName = errorName || 'Error';
  priv.serializer = new ObjectSerializer();

  var pub = Object.create(NoDSL);
  pub.check = check.bind(null, priv);
  return pub;
}

function check(priv, condition) {
  if (condition) {
    return;
  }
  var message = [].slice
    .call(arguments, 2)
    .map(function(arg) { return typeof arg === 'string'? arg: priv.serializer.serializeAny(arg); })
    .join('');

  var error = new Error(message);
  error.name = priv.errorName;
  throw error;
}

/*
  eslint-env node
 */

