'use strict';

var nodsl = require('../nodsl');

var proto = {};

module.exports = {
  contextProto: proto,
  add: addNoop,
};

// registers a new noop
function addNoop(name) {
  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);

  Object.defineProperty(proto, name, {
    get: returnThis,
    enumerable: true,
  });
}

function returnThis() {
  return this;
}

/*
  eslint-env node
 */

