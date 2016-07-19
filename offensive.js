'use strict';

var OffensiveCore = require('./lib/core');

var NoopRegistry = require('./lib/registry/noop');
var AssertionRegistry = require('./lib/registry/assertion');
var OperatorRegistry = require('./lib/registry/operator');

var builtInNoops = require('./lib/built-ins/noops');
var builtInAssertions = require('./lib/built-ins/assertions');
var builtInOperators = require('./lib/built-ins/operators');

var noopRegistry = new NoopRegistry();
builtInNoops.forEach(function(name) {
  noopRegistry.add(name);
});

var assertionRegistry = new AssertionRegistry(noopRegistry);
Object.keys(builtInAssertions).forEach(function(name) {
  assertionRegistry.add(name, builtInAssertions[name]);
});

var operatorRegistry = new OperatorRegistry(noopRegistry, assertionRegistry);
Object.keys(builtInOperators).forEach(function(name) {
  operatorRegistry.add(name, builtInOperators[name]);
});

var core = new OffensiveCore(assertionRegistry, operatorRegistry);

module.exports = core.newCheck.bind(core);
module.exports.addNoop = noopRegistry.add.bind(noopRegistry);
module.exports.addAssertion = assertionRegistry.add.bind(assertionRegistry);
module.exports.addOperator = operatorRegistry.add.bind(operatorRegistry);

/*
  eslint-env node
 */

