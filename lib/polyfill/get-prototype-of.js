'use strict';

module.exports = originalOrPolyfill();

function originalOrPolyfill() {
  try {
    Object.getPrototypeOf("string");
    // didn't throw for non-object - ES6
    return Object.getPrototypeOf;
  } catch(e) {
    // ES5
    return polyfill;
  }
}

function polyfill(instance) {
  return instance.__proto__;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */

