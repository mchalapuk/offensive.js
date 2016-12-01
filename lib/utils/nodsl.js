'use strict';

module.exports = {
  check: noDslCheck,
};

function noDslCheck(condition) {
  if (!condition) {
    throw new Error([].slice.call(arguments, 1).join(''));
  }
}

/*
  eslint-env node
 */

