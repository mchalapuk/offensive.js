'use strict';

var Operator = require('../classes/operator').default;
var BinaryOperator = require('../classes/binary-operator').default;
var Alias = require('../classes/alias').default;

var nodsl = require('../nodsl');
var noopProto = require('./noop').contextProto;
var assertionProto = require('./assertion').contextProto;

var proto = Object.create(noopProto);
var registered = {};

module.exports = {
  contextProto: proto,
  add: addOperator,
};

// registers a new operator
function addOperator(name, operator) {
  if (operator instanceof Alias) {
    var aliased = registered[operator.aliasFor];
    nodsl.check(typeof aliased === 'object',
        'operator of name ', operator.aliasFor, ' pointed by alias ', name, ' not found');
    addOperator(name, aliased);
    return;
  }

  nodsl.check(typeof name === 'string', 'name must be a string; got ', name);
  nodsl.check(!(name in registered), 'operator of name ', name, ' already registered');
  nodsl.check(operator instanceof Operator, 'operator must be an instance of Operator');

  registered[name] = operator;

  // only binary operators in operatorProto
  var actualProto = operator instanceof BinaryOperator? proto: assertionProto;

  Object.defineProperty(actualProto, name, {
    get: function() { return this.add(name, operator); },
    enumerable: true,
  });
}

/*
  eslint-env node
 */

