'use strict';

module.exports = ExpressionStack;

function ExpressionStack() {
  var priv = {
    current: new Level('bottom'),
  };

  var pub = {};
  bindMethods(pub, [push, pop], priv);
  bindProperties(pub, [stackId, stackName, syntax], priv);
  return pub;
}

function push(priv, stackName) {
  priv.current = new Level(stackName);
}

function pop(priv, force) {
}

function stackId(priv) {
}

function stackName(priv) {
  return priv.current.stackName;
}

function syntax(priv) {
}

// level

function Level(stackName) {
  this.stackName = stackName;
}

// utils

function bindMethods(pub, methods, priv) {
  methods.forEach(function(method) { pub[method.name] = method.bind(null, priv) });
}

function bindProperties(pub, getters, priv) {
  getters.forEach(function(getter) {
    Object.defineProperty(pub, getter.name, {
      get: getter.bind(null, priv),
      set: function() { throw new Error('property '+ getter.name +' is read-only'); }
    });
  });
}


/*
  eslint-env node
 */

