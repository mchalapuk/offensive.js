'use strict';

var nodsl = require('../nodsl');

module.exports = NoopRegistry;

function NoopRegistry() {
  this.contextProto = {};
}

NoopRegistry.prototype = {
  add: function addNoop(name) {
    nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

    Object.defineProperty(this.contextProto, name, {
      get: returnThis,
      enumerable: true,
    });
  },
};

function returnThis() {
  return this;
}

/*
  eslint-env node
 */

