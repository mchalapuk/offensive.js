'use strict';

module.exports = {
  isNumber: isNumber,
  isArray: isArray,
  isNull: isNull,
  isUndefined: isUndefined,
};

function isNumber(value) {
  return typeof value === 'number';
}
function isArray(value) {
  return typeof value === 'object' && !isNull(value) &&
    typeof value.splice === 'function' && typeof value.forEach === 'function';
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return typeof value === 'undefined';
}

/*
  eslint-env node
 */

