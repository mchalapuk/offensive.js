'use strict';

module.exports = Object.assign || polyfill;

function polyfill(target) {
  var sources = [].slice.call(arguments, 1);
  return sources.reduce(assign0, target);
}

function assign0(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */

