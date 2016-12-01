'use strict';

module.exports = AssertionMessage;

function AssertionMessage() {
  var priv = {};
  priv.suppliers = [];

  var pub = {};
  bindMethods(pub, [ prependString, appendString, appendValue, applyVisitor ], priv);
  return pub;
}

function prependString(priv, str) {
  prepend(priv, 'String', str);
}

function appendString(priv, str) {
  append(priv, 'String', str);
}

function appendValue(priv, val) {
  append(priv, 'Value', val);
}

function applyVisitor(priv, visitor) {
  priv.suppliers.forEach(call(visitor));
}

function bindMethods(pub, methods, priv) {
  methods.forEach(function(method) { pub[method.name] = method.bind(null, priv); });
}

function prepend(priv, name, value) {
  priv.suppliers.splice(0, 0, { name: name, value: value });
}

function append(priv, name, value) {
  priv.suppliers.push({ name: name, value: value });
}

function call(visitor) {
  return function(supplier) {
    visitor['visit'+ supplier.name](supplier.value);
  };
}

/*
  eslint-env node
 */

