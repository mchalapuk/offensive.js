'use strict';

var Assertion = require('./model/assertion');
var UnaryOperator = require('./model/unary-operator');

var nodsl = require('./nodsl');

module.exports = MessageBuilder;

// code that builds error message is invoked only when assertion fails
// performace is not a concern here
function MessageBuilder(context) {
  var that = Object.create(MessageBuilder.prototype);
  that.context = context;
  that.assertions = [];
  return that;
}

MessageBuilder.prototype = {
  addAssertions: function addAssertions(assertions) {
    this.assertions = this.assertions.concat(assertions);
    return this;
  },

  build: function build() {
    nodsl.check(this.assertions.length !== 0, 'no assertions added');

    var groupByName = groupByVariableName.bind(null, this.context);
    var toString = groupToString.bind(null, this.context);

    var grouped = this.assertions
      .reduce(replaceEmptyWithChildren, [])
      .reduce(mergeWithOperators(), [])
//      .map(tee.bind(null, console.log))
      .reduce(removeDuplicates, [])
      .reduce(groupByName, []);

    function buildMessage(builder, group) {
      return builder + toString(group);
    }

    grouped[0].operators.binary = '';
    var message = grouped.reduce(buildMessage, '');
    return message;
  },
};

function removeDuplicates(retVal, assertion) {
  var previous = retVal[retVal.length - 1];
  if (retVal.length === 0 ||
      previous.message !== assertion.message ||
      !arrayEqual(previous.args, assertion.args)) {
    retVal.push(assertion);
  }
  return retVal;
}

// naive implementation
function arrayEqual(lhs, rhs) {
  return JSON.stringify(lhs) === JSON.stringify(rhs);
}

function replaceEmptyWithChildren(retVal, group) {
  if (group.message.length !== 0) {
    retVal.push(group);
  } else {
    group.children.reduce(replaceEmptyWithChildren, retVal);
  }
  return retVal;
}

function mergeWithOperators() {
  var unary = [];
  var binary = null;

  return function(retVal, assertionOrOperator) {
    if (assertionOrOperator instanceof Assertion) {
      var assertion = assertionOrOperator;
      assertion.operators = { unary: unary, binary: binary };
      unary = [];
      binary = null;
      retVal.push(assertion);
      return retVal;
    }

    var operator = assertionOrOperator;
    if (operator instanceof UnaryOperator) {
      unary.push(operator.message);
      return retVal;
    }

    if (binary) {
      throw new Error('BUG! Two binary operators before one assertion.');
    }
    binary = operator.message;
    return retVal;
  };
}

function groupByVariableName(context, retVal, assertion) {
  var name = assertion.getter.name(context);
  var current = retVal.length === 0? createGroup(assertion): retVal.pop();
  var currentName = current.getter.name(context);
  if (name !== currentName) {
    retVal.push(current);
    current = createGroup(assertion);
  }
  var operators = operatorsToString(assertion.operators).full;
  var message = ensureArray(assertion.message).join(' ');
  current.message.push(operators + message);
  current.result &= assertion.result;
  retVal.push(current);
  return retVal;
}

function createGroup(assertion) {
  // has the same properties as assertion
  var group = {
    operators: assertion.operators,
    getter: assertion.getter,
    message: [],
    result: true,
  };
  assertion.operators = { unary: [], binary: '' };
  return group;
}

function groupToString(context, group) {
  var operators = operatorsToString(group.operators);
  if (operators.binary) {
    operators.binary = ' '+ operators.binary;
  }
  var name = group.getter.name(context);
  var conditions = group.message.join(' ');
  var value = group.getter.value(context);
  var retVal = operators.binary + name +' must be '+ operators.unary + conditions +'; got '+ value;
  return retVal;
}

function operatorsToString(operators) {
  var unary = operators.unary.join(' ');
  if (unary.length) {
    unary += ' ';
  }
  var binary = operators.binary || '';
  if (binary.length) {
    binary += ' ';
  }
  return {
    binary: binary,
    unary: unary,
    full: binary + unary,
  };
}

function ensureArray(value) {
  return value instanceof Array? value: [ value ];
}

// debugging

/* eslint-disable no-unused-vars */

function tee(func, group) {
  func(group);
  return group;
}

function pipe() {
  var pipeline = [].slice.call(arguments);

  return function(initialArg) {
    return pipeline.reduce(function(arg, filter) { return filter(arg); }, initialArg);
  };
}

/*
  eslint-env node
 */

