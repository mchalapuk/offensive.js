'use strict';

module.exports = AssertionMessage;

function AssertionMessage() {
  var priv = {};
  priv.suppliers = [];

  var pub = {};
  bindMethods(pub, [ appendText, appendValue, isEmpty, applyVisitor ], priv);
  return pub;
}

function appendText(pub, priv, str) {
  if (str.length !== 0) {
    append(priv, 'Text', str);
  }
  return pub;
}

function appendValue(pub, priv, val) {
  append(priv, 'Value', val);
  return pub;
}

function isEmpty(pub, priv) {
  return priv.suppliers.length === 0;
}

function applyVisitor(pub, priv, visitor) {
  return priv.suppliers.map(call(visitor));
}

function bindMethods(pub, methods, priv) {
  methods.forEach(function bound(method) { pub[method.name] = method.bind(null, pub, priv); });
}

function append(priv, name, value) {
  priv.suppliers.push({ name: name, value: value });
}

function call(visitor) {
  return function(supplier) {
    return visitor['visit'+ supplier.name](supplier.value);
  };
}

/*
  eslint-env node
 */

