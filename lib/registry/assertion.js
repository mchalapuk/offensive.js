'use strict';

var Assertion = require('../model/assertion');
var ParameterizedAssertion = require('../model/parameterized-assertion');
var Alias = require('../model/alias');

var NoopRegistry = require('./noop');

var nodsl = require('../utils/nodsl');

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
        value: assert(name, assertion),
        enumerable: true,
      });
    } else {
      Object.defineProperty(this.contextProto, name, {
        get: assert(name, assertion),
        enumerable: true,
      });
    }
  },
};

var NON_BUG_ERROR_NAMES = [ 'ContractError', 'ArgumentError' ];

function assert(name, assertion) {
  return function() {
    var args = [].slice.call(arguments);

    try {
      return this._assert(name, assertion, args);

    } catch (e) {
      // shortening the stacktrace in case of ContractError or ArgumentError
      if (NON_BUG_ERROR_NAMES.indexOf(e.name) !== -1) {
        var error = new Error(e.message);
        error.name = e.name;
        error.cause = e;
        throw error;
      }

      // anything else is an internal bug
      if (!e.offensiveAugmented) {
        e.name = 'BUG! ('+ e.name +')';
        e.message += '\n\n> Unless it\'s caused by extension of yours, please submit an issue at\n'+
          '>\n>  https://github.com/muroc/offensive.js/issues\n>\n> Thanks for your help!\n';
        e.offensiveAugmented = true;
      }
      throw e;
    }
  };
}

/*
  eslint-env node
 */

