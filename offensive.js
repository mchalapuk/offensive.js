'use strict';

module.exports = function(value, name) {
  return check(value, name);
};

module.exports.addAssertion = addAssertion;
module.exports.addOperator = addOperator;
module.exports.addNoop = addNoop;

module.exports.Assertion = Assertion;
module.exports.AssertionWithArguments = AssertionWithArguments;
module.exports.UnaryOperator = UnaryOperator;
module.exports.BinaryOperator = BinaryOperator;
module.exports.Alias = Alias;

// Object.setPrototypeOf polyfill
if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = function(instance, prototype) {

    /* eslint-disable no-proto */
    instance.__proto__ = prototype;

    /* eslint-enable no-proto */
  };
}

// contains all noop methods
var noopProto = {};

// registers a new assertion
function addNoop(name) {
  checkName(name);
  Object.defineProperty(noopProto, name, {
    get: returnThis,
    enumerable: true,
  });
}

function returnThis() {
  return this;
}

// contains all assertion objects
var assertionDefinitions = {};

// contains all assertion methods
var assertProto = Object.create(noopProto);

// registers a new assertion
function addAssertion(name, assertion) {
  if (assertion instanceof Alias) {
    addAssertion(name, getAliased(assertion));
    return;
  }

  checkAssertionName(name);
  checkAssertion(assertion);

  assertionDefinitions[name] = assertion;

  if (assertion instanceof AssertionWithArguments) {
    Object.defineProperty(assertProto, name, {
      value: function() { return this.add(name, assertion, [].slice.call(arguments)); },
      enumerable: true,
    });
  } else {
    Object.defineProperty(assertProto, name, {
      get: function() { return this.add(name, assertion); },
      enumerable: true,
    });
  }
}

// contains all operator objects
var operatorDefinitions = {};

// contains all operator methods
var operatorProto = Object.create(noopProto);

// registers a new assertion
function addOperator(name, operator) {
  if (operator instanceof Alias) {
    addOperator(name, getAliased(operator));
    return;
  }

  checkOperatorName(name);
  checkOperator(operator);

  operatorDefinitions[name] = operator;

  // only binary operators in operatorProto
  var proto = operator instanceof BinaryOperator? operatorProto: assertProto;

  Object.defineProperty(proto, name, {
    get: function() { return this.add(name, operator); },
    enumerable: true,
  });
}

// this must work when no assertions are added yet,
// so checks are implemented in vanilla javascript
function checkAssertionName(name) {
  checkName(name);
  if (name in assertionDefinitions) {
    throw new Error('assertion of name '+ name +' already registered');
  }
}
function checkName(name) {
  if (typeof name !== 'string') {
    throw new Error('name must be a string; got '+ name);
  }
}
function checkAssertion(assertion) {
  if (!(assertion instanceof Assertion)) {
    throw new Error('assertion must be an instance of Assertion');
  }
}
function checkOperatorName(name) {
  checkName(name);
  if (name in operatorDefinitions) {
    throw new Error('operator of name '+ name +' already registered');
  }
}
function checkOperator(operator) {
  if (!(operator instanceof UnaryOperator || operator instanceof BinaryOperator)) {
    throw new Error('operator must be an instance of UnaryOperator or BinaryOperator');
  }
}

function getAliased(assertion) {
  var aliased = assertionDefinitions[assertion.aliasFor];
  if (aliased) {
    return aliased;
  }
  aliased = operatorDefinitions[assertion.aliasFor];
  if (aliased) {
    return aliased;
  }
  throw new Error('no assertion assertion or operator of name '+ assertion.aliasFor +' registered');
}

// built in getters
var getters = {
  value: {
    name: function(context) { return context.name; },
    value: function(context) { return context.value; },
  },
  property: function(propertyName) {
    return {
      name: function(context) { return context.name +'.'+ propertyName; },
      value: function(context) { return context.value[propertyName]; },
    };
  },
  element: function(index) {
    return {
      name: function(context) { return context.name +'['+ index +']'; },
      value: function(context) { return context.value[index]; },
    };
  },
};

module.exports.getters = getters;

// assertion classes
function Assertion(assertFunction) {
  var that = Object.create(Assertion.prototype);
  that.runInContext = assertFunction;
  that.done = [];
  return that;
}

Assertion.prototype = {
  getter: getters.value,
  message: [],
};

function AssertionWithArguments(assertFunction) {
  var that = Object.create(AssertionWithArguments.prototype);
  that.runInContext = assertFunction;
  return that;
}

AssertionWithArguments.prototype = new Assertion();

function Alias(originalName) {
  var that = Object.create(Alias.prototype);
  that.aliasFor = originalName;
  return that;
}

Alias.prototype = {};

function TypeofAssertion(requiredType) {
  function hasProperType(value) {
    return typeof value === requiredType;
  }
  var that = Object.create(Assertion.prototype);
  that.runInContext = function(context) {
    this.message = getTypePrefix(requiredType) + requiredType;
    context.assert(hasProperType);
  };
  return that;
}

TypeofAssertion.prototype = new Assertion();

// operator classes

function Operator() {
}

Operator.prototype = {
  message: [],
};

function UnaryOperator(operatorFunction) {
  var that = Object.create(UnaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

UnaryOperator.prototype = new Operator();

function BinaryOperator(operatorFunction) {
  var that = Object.create(BinaryOperator.prototype);
  that.runInContext = operatorFunction;
  return that;
}

BinaryOperator.prototype = new Operator();

// assertion definitions
var builtInAssertions = {
  // null assertions
  'Null': new Assertion(function(context) {
    this.message = 'null';
    context.assert(isNull);
  }),
  'nil': new Alias('Null'),
  'Empty': new Assertion(function(context) {
    this.message = 'empty';
    context.assert(isNullOrUndefined);
  }),
  'empty': new Alias('Empty'),

  // typeof assertions
  'aString': new TypeofAssertion('string'),
  'aNumber': new TypeofAssertion('number'),
  'aFunction': new TypeofAssertion('function'),
  'anObject': new TypeofAssertion('object'),
  'Undefined': new TypeofAssertion('undefined'),

  // duck typing assertions
  'anArray': new Assertion(function(context) {
    this.message = 'an array';
    context.assert(isArray);
  }),

  // property assertions
  'property': new AssertionWithArguments(function(context, propertyName, propertyValue) {
    check(propertyName, 'propertyName').is.aString();

    context.push();
    if (!context.is.not.Empty.result) {
      context.pop();
      return;
    }

    this.getter = getters.property(propertyName);
    if (typeof propertyValue !== 'undefined') {
      this.message = propertyValue;
      context.assert(function PropertyHasValue(value) {
        return value[propertyName] === propertyValue;
      });
    } else {
      this.message = 'not undefined';
      context.assert(function PropertyIsDefined(value) {
        return !isUndefined(value[propertyName]);
      });
    }
    context.pop();
  }),

  // length assertions
  'length': new AssertionWithArguments(function(context, requiredLength) {
    check(requiredLength, 'requiredLength').is.aNumber();
    context.has.property('length', requiredLength);
  }),
  // TODO 'lengthGT': new Alias('lengthGreaterThan'),
  // TODO 'lengthLT': new Alias('lengthLessThan'),

  // array element assertions
  'eachElementIs': new AssertionWithArguments(function(context, assertName, assertFunction) {
    check(assertName, 'assertName').is.aString();
    check(assertFunction, 'assertFunction').is.aFunction();

    context.push();
    if (!context.is.anArray.result) {
      context.pop();
      return;
    }

    context.value.forEach(function(elem, i) {
      context.add(new Assertion(function(innerContext) {
        this.getter = getters.element(i);
        this.message = assertName;
        innerContext.assert(function elemSatisfiesAssertion() {
          return assertFunction(elem);
        });
      }));
    });
    context.pop();
  }),
  'numberElements': new AssertionWithArguments(function(context) {
    context.eachElementIs('a number', isNumber);
  }),
};

Object.keys(builtInAssertions).forEach(function(name) {
  addAssertion(name, builtInAssertions[name]);
});

// operator definitions
var builtInOperators = {
  'and': new BinaryOperator(function() {
    this.message = 'and';
  }),
  'of': new Alias('and'),
  'with': new Alias('and'),

  'not': new UnaryOperator(function(context, state) {
    this.message = 'not';

    var previousStrategy = state.strategy;
    state.strategy = notStrategy;

    function notStrategy(condition, _context, _state) {
      _state.strategy = previousStrategy;
      return _state.strategy(negatedCondition, _context, _state);

      function negatedCondition(value) {
        return !condition(value);
      }
    }
  }),

  // either and or must be used in combination
  'either': new UnaryOperator(function(context) {
    context.push().insideEither = true;
  }),
  'weather': new Alias('either'),

  'or': new BinaryOperator(function(context, state) {
    if (!state.insideEither) {
      throw new Error('.or used without .either');
    }
    this.message = 'or';
    state.strategy = orStrategy;

    function orStrategy(condition, _context, _state) {
      var result = condition(context.value);
      _state.result = _state.result || result;
      _context.pop();
      return result;
    }
  }),
};

Object.keys(builtInOperators).forEach(function(name) {
  addOperator(name, builtInOperators[name]);
});

// noop definitions
var builtInNoops = [
  'is', 'be', 'being',
  'which', 'that',
  'to', 'from', 'under', 'over',
  'has', 'have',
  'defines', 'define',
  'contains', 'contain',
  'precondition', 'postcondition', 'invariant',
];

builtInNoops.forEach(addNoop);

// exported check function
function check(value, name) {

  var context = Object.create(assertProto);
  context.value = value;
  context.name = name;
  context.add = add;

  var operatorContext = function() {
    return context.value;
  };
  operatorContext.value = value;
  operatorContext.add = runOperator;
  Object.setPrototypeOf(operatorContext, operatorProto);

  var priv = {};
  priv.state = new State();
  priv.stack = [];
  priv.current = null;

  // to be used inside assertions (for precondition checking)
  Object.defineProperty(operatorContext, 'result', {
    get: function() { return priv.state.result; },
    set: function() { throw new Error('.result is a read-only property'); },
  });

  var extendedContext = extendContext(context, [ push, pop, assert ]);
  var extendedOperatorContext = extendContext(context, [ push, pop ]);

  var finish = flushAndReturn;
  return context;

  // all assertion methods call this one
  // it can also be used to run assertions without adding them globally
  // `check(arg, 'arg').add(new Assertion(...))()`
  function add(operationName, operationProto, args) {
    var impl = operationProto instanceof Assertion? runAssertion: runOperator;
    return impl(operationName, operationProto, args);
  }
  function runAssertion(assertionName, proto, args) {
    var assertion = Object.create(proto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.done = [];
    run(assertion, [ extendedContext ].concat(assertion.args));
    return operatorContext;
  }
  function runOperator(operatorName, proto) {
    var operator = Object.create(proto);
    operator.name = operatorName;
    operator.done = [];
    run(operator, [ extendedOperatorContext, priv.state ]);
    return context;
  }

  // to be used inside assertions
  function push() {
    priv.stack.push(priv.state);
    priv.state = new State();
    priv.state.done = priv.current.done;
    finish = justReturn;
    return priv.state;
  }
  function pop() {
    var result = priv.state.result;
    function returnResult() {
      return result;
    }

    priv.state = priv.stack.pop();
    if (priv.stack.length === 0) {
      finish = flushAndReturn;
    }
    priv.state.strategy(returnResult, extendedContext, priv.state);
    return priv.state;
  }
  // (I wonder if there is a way to implement this without double IoC)
  function assert(condition) {
    priv.current.result = priv.state.strategy(condition, extendedContext, priv.state);
    return priv.state.result;
  }

  // private
  function run(operation, args) {
    priv.state.done.push(operation);

    var previous = priv.current;
    priv.current = operation;
    operation.runInContext.apply(operation, args);
    priv.current = previous;
    finish();
  }
  function extendContext(proto, methods) {
    var extended = Object.create(proto);
    methods.forEach(function(method) { extended[method.name] = method; });
    return extended;
  }

  // finish functions
  function flushAndReturn() {
    if (!priv.state.result) {
      throw new Error(buildMessage(context, priv.state));
    }
    // everything so far satisfied, so not needed in error message
    priv.state.done = [];
    return context.value;
  }
  function justReturn() {
    return context.value;
  }
}

// this gets pushed around alot
function State() {
  this.done = [];
  this.result = true;
}

State.prototype = {
  strategy: andStrategy,
};

// strategies for hangling boolean operators
function andStrategy(condition, context, state) {
  var result = condition(context.value);
  state.result = state.result && result;
  return result;
}

// check helpers
function isNumber(value) {
  return typeof value === 'number';
}
function isArray(value) {
  return typeof value === 'object' && !isNull(value) &&
    typeof value.splice === 'function' && typeof value.forEach === 'function';
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return typeof value === 'undefined';
}
function isNullOrUndefined(value) {
  return isNull(value) || isUndefined(value);
}
function getTypePrefix(type) {
  return type === 'object'? 'an ': type === 'undefined'? '': 'a ';
}

// code that builds error message is invoked only when assertion fails
// from this moment, performace is not a concern here
function buildMessage(context, state) {
  var groupByName = groupByVariableName.bind(null, context);
  var toString = groupToString.bind(null, context);

  var message = state.done
    .reduce(replaceEmptyWithChildren, [])
    .reduce(mergeWithOperators(), [])
//    .map(tee.bind(null, console.log))
    .reduce(removeDuplicates, [])
    .reduce(groupByName, [])
    .reduce(function(builder, group) { return builder + toString(group); }, '');

  return message;
}

function removeDuplicates(retVal, assertion) {
  if (retVal.length === 0 || retVal[retVal.length - 1].message !== assertion.message) {
    retVal.push(assertion);
  }
  return retVal;
}

function replaceEmptyWithChildren(retVal, group) {
  if (group.message && group.message.length !== 0) {
    retVal.push(group);
  } else {
    group.done.reduce(replaceEmptyWithChildren, retVal);
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
  return isArray(value)? value: [ value ];
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

/*
  global window
 */

