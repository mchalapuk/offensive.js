'use strict';

var Assertion = require('../model/assertion');
var ParameterizedAssertion = require('../model/parameterized-assertion');
var Alias = require('../model/alias');

var NoopRegistry = require('./noop');

var nodsl = require('../nodsl');

module.exports = AssertionRegistry;

function AssertionRegistry(noopRegistry) {
  nodsl.check(noopRegistry instanceof NoopRegistry,
      'noopRegistry must be an instance of NoopRegistry; got ', noopRegistry);

  this.contextProto = Object.create(noopRegistry.contextProto);
  this.registered = {};
}

AssertionRegistry.prototype = {
  add: function addAssertion(name, assertion) {
    if (assertion instanceof Alias) {
      var aliased = this.registered[assertion.aliasFor];
      nodsl.check(typeof aliased === 'object',
          'assertion of name ', assertion.aliasFor, ' pointed by alias ', name, ' not found');
      this.add(name, aliased);
      return;
    }

    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
    nodsl.check(!(name in this.registered), 'assertion of name ', name, ' already registered');
    nodsl.check(assertion instanceof Assertion, 'assertion must be an instance of Assertion');

    this.registered[name] = assertion;

    if (assertion instanceof ParameterizedAssertion) {
      Object.defineProperty(this.contextProto, name, {
        value: function() { return this._add(name, assertion, [].slice.call(arguments)); },
        enumerable: true,
      });
    } else {
      Object.defineProperty(this.contextProto, name, {
        get: function() { return this._add(name, assertion); },
        enumerable: true,
      });
    }
  },
};

/*
  eslint-env node
 */

