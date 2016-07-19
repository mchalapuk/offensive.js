'use strict';

module.exports = {
  isNumber: isNumber,
  isArray: isArray,
  isNull: isNull,
  isUndefined: isUndefined,
  isNullOrUndefined: isNullOrUndefined,
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
function isNullOrUndefined(value) {
  return isNull(value) || isUndefined(value);
}

/*
  eslint-env node
 */

