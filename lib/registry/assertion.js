'use strict';

var Assertion = require('../classes/assertion').default;
var AssertionWithArguments = require('../classes/assertion-with-arguments').default;
var Alias = require('../classes/alias').default;

var nodsl = require('../nodsl');
var noopProto = require('./noop').contextProto;

var proto = Object.create(noopProto);
var registered = {};

module.exports = {
  contextProto: proto,
  add: addAssertion,
};

// registers a new assertion
function addAssertion(name, assertion) {
  if (assertion instanceof Alias) {
    var aliased = registered[assertion.aliasFor];
    nodsl.check(typeof aliased === 'object',
        'assertion of name ', assertion.aliasFor, ' pointed by alias ', name, ' not found');
    addAssertion(name, aliased);
    return;
  }

  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
  nodsl.check(!(name in registered), 'assertion of name ', name, ' already registered');
  nodsl.check(assertion instanceof Assertion, 'assertion must be an instance of Assertion');

  registered[name] = assertion;

  if (assertion instanceof AssertionWithArguments) {
    Object.defineProperty(proto, name, {
      value: function() { return this.add(name, assertion, [].slice.call(arguments)); },
      enumerable: true,
    });
  } else {
    Object.defineProperty(proto, name, {
      get: function() { return this.add(name, assertion); },
      enumerable: true,
    });
  }
}

/*
  eslint-env node
 */

