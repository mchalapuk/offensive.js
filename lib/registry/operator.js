'use strict';

var Operator = require('../model/operator');
var BinaryOperator = require('../model/binary-operator');
var Alias = require('../model/alias');

var NoopRegistry = require('./noop');
var AssertionRegistry = require('./assertion');

var nodsl = require('../nodsl');

module.exports = OperatorRegistry;

function OperatorRegistry(noopRegistry, assertionRegistry) {
  nodsl.check(noopRegistry instanceof NoopRegistry,
      'noopRegistry must be an instance of NoopRegistry; got ', noopRegistry);
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);

  this.contextProto = Object.create(noopRegistry.contextProto);
  this.assertionProto = assertionRegistry.contextProto;
  this.registered = {};
}

OperatorRegistry.prototype = {
  add: function addOperator(name, operator) {
    if (operator instanceof Alias) {
      var aliased = this.registered[operator.aliasFor];
      nodsl.check(typeof aliased === 'object',
          'operator of name ', operator.aliasFor, ' pointed by alias ', name, ' not found');
      this.add(name, aliased);
      return;
    }

    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
    nodsl.check(!(name in this.registered), 'operator of name ', name, ' already registered');
    nodsl.check(operator instanceof Operator, 'operator must be an instance of Operator');

    this.registered[name] = operator;

    // only binary operators in operatorProto
    var actualProto = operator instanceof BinaryOperator? this.contextProto: this.assertionProto;

    Object.defineProperty(actualProto, name, {
      get: function() { return this.add(name, operator); },
      enumerable: true,
    });
  },
};

/*
  eslint-env node
 */

