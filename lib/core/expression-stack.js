'use strict';

var SyntaxTreeBuilder = require('./syntax-tree-builder');

var nodsl = require('../utils/nodsl');

module.exports = ExpressionStack;

function ExpressionStack(maybeResultCallback) {
  var resultCallback = maybeResultCallback || noop;
  nodsl.check(typeof resultCallback === 'function',
      'callback must be a function; got ', resultCallback);

  var priv = {
    current: new Level(0, 'bottom'),
    stack: [],
    nextStackId: 1,
  };

  priv.current.syntax.onEvaluateReady = resultCallback;

  var pub = {};
  bindMethods(pub, [
    push, pop, forcePop, popWhenReady, flush,
    addOperand, addUnaryOperator, addBinaryOperator,
  ], priv);
  bindProperties(pub, [ stackId, stackName, result ], priv);
  return pub;
}

function push(priv, stackLevelName) {
  priv.stack.push(priv.current);
  priv.current = new Level(priv.nextStackId++, stackLevelName);
}

function pop(priv, stackLevelName) {
  checkPopPreconditions(priv, 'pop', stackLevelName);

  var topSyntax = priv.current.syntax;
  priv.current = priv.stack.pop();
  addOperand(priv, topSyntax.evaluate());
}

function forcePop(priv, stackLevelName) {
  checkPopPreconditions(priv, 'forcePop', stackLevelName);

  var topSyntax = priv.current.syntax;
  topSyntax.addOperand(returnTrue);
  priv.current = priv.stack.pop();
  addOperand(priv, topSyntax.evaluate());
}

function popWhenReady(priv, stackLevelName, maybeOnBeforePop) {
  checkPopPreconditions(priv, 'popWhenReady', stackLevelName);

  var syntax = priv.current.syntax;
  nodsl.check(!syntax.isEvaluateReady(),
      '.popWhenReady() called on a stack, which is ready; use .pop() instead');

  var onBeforePop = maybeOnBeforePop || noop;

  syntax.onEvaluateReady = function() {
    onBeforePop();
    pop(priv, stackLevelName);
  };
}

function checkPopPreconditions(priv, methodName, stackLevelName) {
  nodsl.check(priv.stack.length !== 0, '.', methodName, '() called at the bottom of the stack');

  if (priv.current.stackName) {
    checkStackLevelEquals(priv, methodName, stackLevelName);

  } else if (stackLevelName) {
    var distance = findStackByName(priv, stackLevelName);
    throw new Error(
        'expected call .'+ methodName +'(); got .'+ methodName +'(\''+ stackLevelName +'\'); '+
        'stack level of name \''+ stackLevelName +'\' '+
        (distance === -1? 'does not exist': 'is '+ distance +' level(s) below'));
  }
}

function checkStackLevelEquals(priv, methodName, stackLevelName) {
  nodsl.check(stackLevelName,
      'expected call .', methodName, '(\'', priv.current.stackName, '\'); ',
      'got .', methodName, '()');

  var distance = findStackByName(priv, stackLevelName);
  nodsl.check(distance === 0,
      'expected call .', methodName, '(\'', priv.current.stackName, '\'); ',
      'got .', methodName, '(\'', stackLevelName, '\'); ',
      'stack level of name \'', stackLevelName, '\' ',
      distance === -1? 'does not exist': 'is '+ distance +' level(s) below');
}

function findStackByName(priv, stackLevelName) {
  if (priv.current.stackName === stackLevelName) {
    return 0;
  }
  var found = priv.stack.reverse()
    .map(function(level, i) { return [ i, level ]; })
    .filter(function(tuple) { return tuple[1].stackName === stackLevelName; });
  return found.length === 0? -1: found[0][0] + 1;
}

function flush(priv) {
  priv.current.syntax.flush();
}

function addOperand(priv, operand, callback) {
  priv.current.syntax.addOperand(operand, callback);
}

function addUnaryOperator(priv, operator, callback) {
  priv.current.syntax.addUnaryOperator(operator, callback);
}

function addBinaryOperator(priv, operator, callback) {
  priv.current.syntax.addBinaryOperator(operator, callback);
}

function result(priv) {
//  nodsl.check(priv.stack.length === 0, 'couldn\t fetch .result (not at the bottom of the stack)');

  return priv.current.syntax.evaluate()();
}

function stackId(priv) {
  return priv.current.stackId;
}

function stackName(priv) {
  return priv.current.stackName;
}

// level

function Level(id, name) {
  this.stackId = id;
  this.stackName = name;
  this.syntax = new SyntaxTreeBuilder();
}

// utils

function bindMethods(pub, methods, priv) {
  methods.forEach(function(method) { pub[method.name] = method.bind(null, priv); });
}

function bindProperties(pub, getters, priv) {
  getters.forEach(function(getter) {
    Object.defineProperty(pub, getter.name, {
      get: getter.bind(null, priv),
      set: function() { throw new Error('property '+ getter.name +' is read-only'); },
    });
  });
}

function returnTrue() {
  return true;
}

function noop() {
  // noop
}

/*
  eslint-env node
 */

