'use strict';

var Assertion = require('./model/assertion');
var UnaryOperator = require('./model/unary-operator');
var ObjectSerializer = require('./object-serializer');

var nodsl = require('./utils/nodsl');

module.exports = MessageBuilder;

// code that builds error message is invoked only when assertion fails
// performace is not a concern here
function MessageBuilder() {
  var that = Object.create(MessageBuilder.prototype);
  that.assertions = [];
  return that;
}

MessageBuilder.prototype = {
  addAssertions: function addAssertions(assertions) {
    this.assertions = this.assertions.concat(assertions);
    return this;
  },

  build: function build(context) {
    nodsl.check(this.assertions.length !== 0, 'trying to build a message without failed assertions');

    var groupByName = groupByVariableName.bind(null, context);
    var toString = groupToString.bind(null, context);

    var grouped = this.assertions
      .reduce(replaceEmptyWithChildren, [])
      .map(serializeMessages)
      .reduce(mergeWithOperators(), [])
      .reduce(removeDuplicates, [])
//      .map(tee.bind(null, console.log))
      .reduce(groupByName, [])
      ;

    function buildMessage(builder, group) {
      return builder + toString(group);
    }

    grouped[0].operators.binary = '';
    var finalMessage = grouped.reduce(buildMessage, '');
    return finalMessage;
  },
};

function replaceEmptyWithChildren(retVal, group) {
  if (group.message.isEmpty()) {
    return group.children.reduce(replaceEmptyWithChildren, retVal);
  }
  retVal.push(group);
  return retVal;
}

function serializeMessages(assertion) {
  var serializer = new ObjectSerializer();

  assertion.serialized = assertion.message.applyVisitor({
    visitText: function(string) { return string; },
    visitValue: function(value) { return serializer.serializeAny(value); },
  });
  return assertion;
}

function removeDuplicates(retVal, assertion) {
  var previous = retVal[retVal.length - 1];
  if (retVal.length === 0 || !equal(previous, assertion)) {
    retVal.push(assertion);
  }
  return retVal;
}

function equal(previous, next) {
  return previous.name === next.name &&
    arrayEqual(previous.args, next.args) &&
    arrayEqual(previous.operators.unary, next.operators.unary);
}

// naive implementation
function arrayEqual(lhs, rhs) {
  return JSON.stringify(lhs) === JSON.stringify(rhs);
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
      unary.push(operator.serialized);
      return retVal;
    }

    if (binary) {
      throw new Error('BUG! Two binary operators before one assertion.');
    }
    binary = operator.serialized;
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
  appendOperators(assertion.operators, current.serialized);
  [].splice.apply(current.serialized, [ current.serialized.length, 0 ].concat(assertion.serialized));
  current.result &= assertion.result;
  retVal.push(current);
  return retVal;
}

function appendOperators(operators, serialized) {
  var operatorStr = operatorsToString(operators);
  if (operatorStr.binary) {
    serialized.push(operatorStr.binary);
  }
  if (operatorStr.unary) {
    serialized.push(operatorStr.unary);
  }
}

function createGroup(assertion) {
  // has the same properties as assertion
  var group = {
    operators: assertion.operators,
    getter: assertion.getter,
    serialized: [],
    result: true,
  };
  assertion.operators = { unary: [], binary: '' };
  return group;
}

function groupToString(context, group) {
  var operators = operatorsToString(group.operators);
  if (operators.binary) {
    operators.binary = ' '+ operators.binary +' ';
  }
  if (operators.unary) {
    operators.unary += ' ';
  }

  var serializer = new ObjectSerializer();

  var name = group.getter.name(context);
  var conditions = group.serialized.join(' ');
  var value = group.getter.value(context);

  var retVal = operators.binary + name +
    ' must be '+ operators.unary + conditions +
    '; got '+ serializer.serializeAny(value);
  return retVal;
}

function operatorsToString(operators) {
  var unary = operators.unary.join(' ');
  var binary = operators.binary || '';
  return {
    binary: binary,
    unary: unary,
  };
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

