'use strict';

Object.assign = require('../../polyfill/assign');

var nullAssertions = require('./null');
var typeAssertions = require('./type');
var propertyAssertions = require('./property');
var arrayAssertions = require('./array');
var booleanAssertions = require('./boolean');
var numberAssertions = require('./number');

module.exports = Object.assign({},
    nullAssertions, typeAssertions, propertyAssertions, arrayAssertions,
    booleanAssertions, numberAssertions
    );

/*
  eslint-env node
 */

