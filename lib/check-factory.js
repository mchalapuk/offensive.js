'use strict';

Object.setPrototypeOf = require('./polyfill/set-prototype-of');

var AssertionRegistry = require('./registry/assertion');
var OperatorRegistry = require('./registry/operator');
var Context = require('./context');

var nodsl = require('./utils/nodsl');

module.exports = CheckFactory;

function CheckFactory(assertionRegistry, operatorRegistry) {
  nodsl.check(assertionRegistry instanceof AssertionRegistry,
      'assertionRegistry must be an instance of AssertionRegistry; got ', assertionRegistry);
  nodsl.check(operatorRegistry instanceof OperatorRegistry,
      'operatorRegistry must be an instance of OperatorRegistry; got ', operatorRegistry);

  var priv = {};
  priv.contextProto = {
    assertion: assertionRegistry.contextProto,
    operator: operatorRegistry.contextProto,
  };
  priv.events = {
    onError: noop,
  };

  var pub = Object.create(CheckFactory.prototype);
  bindMethods(pub, [ newCheck ], priv);
  bindEvents(pub, priv.events);
  return pub;
}

function newCheck(priv, value, name) {
  return new Context(value, name, priv.contextProto, priv.events.onError);
}

function bindMethods(pub, methods, priv) {
  methods.forEach(function(method) { pub[method.name] = method.bind(pub, priv); });
}

function bindEvents(pub, callbacks) {
  Object.keys(callbacks).forEach(function(name) {
    Object.defineProperty(pub, name, {
      configurable: false,
      enumberable: true,
      get: function() { return callbacks[name] === noop? null: callbacks[name]; },
      set: function(callback) { callbacks[name] = callback || noop; },
    });
  });
}

function noop() {
  // noop
}

/*
  eslint-env node
 */

