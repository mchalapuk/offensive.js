'use strict';

var OffensiveCore = require('./lib/core');

var NoopRegistry = require('./lib/registry/noop');
var AssertionRegistry = require('./lib/registry/assertion');
var OperatorRegistry = require('./lib/registry/operator');

var noops = require('./lib/built-ins/noops');
var assertions = require('./lib/built-ins/assertions');
var operators = require('./lib/built-ins/operators');

var noopRegistry = new NoopRegistry();
noops.forEach(function(name) {
  noopRegistry.add(name);
});

var assertionRegistry = new AssertionRegistry(noopRegistry);
Object.keys(assertions).forEach(function(name) {
  assertionRegistry.add(name, assertions[name]);
});

var operatorRegistry = new OperatorRegistry(noopRegistry, assertionRegistry);
Object.keys(operators).forEach(function(name) {
  operatorRegistry.add(name, operators[name]);
});

var core = new OffensiveCore(assertionRegistry, operatorRegistry);

module.exports = core.newCheck.bind(core);
module.exports.addNoop = noopRegistry.add.bind(noopRegistry);
module.exports.addAssertion = assertionRegistry.add.bind(assertionRegistry);
module.exports.addOperator = operatorRegistry.add.bind(operatorRegistry);

/*
  eslint-env node
 */

