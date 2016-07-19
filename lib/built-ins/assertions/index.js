'use strict';

Object.assign = require('../../polyfill/assign');

var nullAssertions = require('./null');
var typeAssertions = require('./type');
var propertyAssertions = require('./property');
var arrayAssertions = require('./array');

module.exports = Object.assign({},
    nullAssertions, typeAssertions, propertyAssertions, arrayAssertions);

/*
  eslint-env node
 */

