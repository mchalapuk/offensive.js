'use strict';

module.exports.default = Alias;

function Alias(originalName) {
  var that = Object.create(Alias.prototype);
  that.aliasFor = originalName;
  return that;
}

Alias.prototype = {};

/*
  eslint-env node
 */

