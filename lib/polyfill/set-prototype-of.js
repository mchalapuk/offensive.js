'use strict';

module.exports = Object.setPrototypeOf || polyfill;

function polyfill(instance, prototype) {
  instance.__proto__ = prototype;
}

/*
  eslint-env node
 */

/*
  eslint no-proto: 0
 */

