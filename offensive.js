'use strict';

var ContextFactory = require('./lib/core/context-factory');

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

var offensive = new ContextFactory(assertionRegistry, operatorRegistry);
offensive.onError = throwContractError;

var defensive = new ContextFactory(assertionRegistry, operatorRegistry);

module.exports = offensive.newContext.bind(offensive);
module.exports.defensive = defensive.newContext.bind(defensive);
module.exports.addNoop = noopRegistry.add.bind(noopRegistry);
module.exports.addAssertion = assertionRegistry.add.bind(assertionRegistry);
module.exports.addOperator = operatorRegistry.add.bind(operatorRegistry);
module.exports.default = module.exports;

function throwContractError(context) {
  var error = new Error(context._message);
  error.name = 'ContractError';
  throw error;
}

/*
  eslint-env node
 */

