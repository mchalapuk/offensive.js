'use strict';

module.exports = function(value, name) {
  return check(value, name);
};

module.exports.addAssertion = addAssertion;
module.exports.Assertion = Assertion;
module.exports.Alias = Alias;

// contains all assertion objects
var assertions = {};

// contains all check methods which call assertions
var assertProto = {};

// registers a new assertion
function addAssertion(name, assertion) {
  checkAssertionName(name);
  checkAssertion(assertion);

  if (assertion instanceof Alias) {
    addAssertion(name, getAliasedAssertion(assertion));
    return;
  }

  assertions[name] = assertion;
  assertion.name = name;

  if (assertion instanceof AssertionWithArguments) {
    Object.defineProperty(assertProto, name, {
      value: function() { return this.add(assertion, [].slice.call(arguments)); },
      enumerable: true,
    });
  } else {
    Object.defineProperty(assertProto, name, {
      get: function() { return this.add(assertion); },
      enumerable: true,
    });
  }
}

// this must work when no assertions are added yet,
// so checks are implemented in vanilla javascript
function checkAssertionName(name) {
  if (typeof name !== 'string') {
    throw new Error('name must be a string; got '+ name);
  }
  if (name in assertions) {
    throw new Error('assertion of name '+ name +' already registered');
  }
}
function checkAssertion(assertion) {
  if (!(assertion instanceof Assertion)) {
    throw new Error('assertion must be an instance of Assertion');
  }
}
function getAliasedAssertion(assertion) {
  var aliased = assertions[assertion.aliasFor];
  if (!aliased) {
    throw new Error('assertion of name '+ assertion.aliasFor +' not registered');
  }
  return aliased;
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

var globalObject = typeof window !== 'undefined'? window: global;

// assertion classes
function Assertion(assertFunction) {
  if (this === globalObject) {
    return new Assertion(assertFunction);
  }
  this.runInContext = assertFunction;
  this.prefix = '';
}

Assertion.prototype = {
  getter: getters.value,
  message: [],
};

function AssertionWithArguments(assertFunction) {
  if (this === globalObject) {
    return new AssertionWithArguments(assertFunction);
  }
  Assertion.call(this, assertFunction);
}

AssertionWithArguments.prototype = new Assertion();

function Alias(originalName) {
  if (this === globalObject) {
    return new Alias(originalName);
  }
  this.aliasFor = originalName;
}

Alias.prototype = new Assertion();

function TypeofAssertion(requiredType) {
  if (this === globalObject) {
    return new TypeofAssertion(requiredType);
  }
  Assertion.call(this, function(context) {
    this.message = (requiredType === 'object'? 'an ':
      requiredType === 'undefined'? '': 'a ') + requiredType;
    return context.assert(function(value) { return typeof value === requiredType; });
  });
}

TypeofAssertion.prototype = new Assertion();

var builtInAssertions = {
  // does nothing
  'is': new Assertion(function(context) {
    return context;
  }),
  'with': new Alias('is'),
  'which': new Alias('is'),
  'that': new Alias('is'),
  'of': new Alias('is'),
  'has': new Alias('is'),
  'either': new Alias('is'),

  // boolean operators (and is default)
  'and': new Alias('is'),
  'or': new Assertion(function(context) {
    context.strategy = orStrategy;
    return context;
  }),
  'not': new Assertion(function(context) {
    var originalModifier = context.modifier;
    context.modifier = function(result) {
      context.modifier = originalModifier;
      return !originalModifier(result);
    };
    var originalStrategy = context.strategy;
    context.strategy = function(condition) {
      context.strategy = originalStrategy;
      originalStrategy(condition);
      context.current.prefix += 'not ';
      return context;
    };
    return context;
  }),

  // null assertions
  'Null': new Assertion(function(context) {
    this.message = 'null';
    return context.assert(isNull);
  }),
  'Empty': new Assertion(function(context) {
    this.message = 'empty';
    return context.assert(isNullOrUndefined);
  }),

  // typeof assertions
  'aString': new TypeofAssertion('string'),
  'aNumber': new TypeofAssertion('number'),
  'aFunction': new TypeofAssertion('function'),
  'anObject': new TypeofAssertion('object'),
  'Undefined': new TypeofAssertion('undefined'),

  // duck typing assertions
  'anArray': new Assertion(function(context) {
    this.message = 'an array';
    return context.assert(isArray);
  }),

  // length assertions
  'length': new AssertionWithArguments(function(context, requiredLength) {
    check(requiredLength, 'requiredLength').is.aNumber();

    context.is.anArray();

    this.message = requiredLength;
    this.getter = getters.property('length');
    return context.assert(function(value) { return value.length === requiredLength; });
  }),
  'lengthGreaterThan': new AssertionWithArguments(function(context, requiredLength) {
    check(requiredLength, 'requiredLength').is.aNumber();

    context.is.anArray();

    this.message = [ '>', requiredLength ];
    this.getter = getters.property('length');
    return context.assert(function(value) { return value.length <= requiredLength; });
  }),
  'lengthLessThan': new AssertionWithArguments(function(context, requiredLength) {
    check(requiredLength, 'requiredLength').is.aNumber();

    context.is.anArray();

    this.message = [ '<', requiredLength ];
    this.getter = getters.property('length');
    return context.assert(function(value) { return value.length >= requiredLength; });
  }),
  'lengthGT': new Alias('lengthGreaterThan'),
  'lengthLT': new Alias('lengthLessThan'),

  // array element assertions
  'eachElementIs': new AssertionWithArguments(function(context, assertName, assertFunction) {
    this.message = check(assertName, 'assertName').is.aString();
    check(assertFunction, 'assertFunction').is.aFunction();

    context.is.anArray();

    var that = this;
    context.value.forEach(function(elem, i) {
      that.getter = getters.element(i);
      context.assert(assertFunction.bind(context, elem));
    });
    return context;
  }),
  'numberElements': new AssertionWithArguments(function(context) {
    return context.eachElementIs('a number', isNumber);
  }),
};

Object.keys(builtInAssertions).forEach(function(name) {
  addAssertion(name, builtInAssertions[name]);
});

// exported check function
function check(value, name) {
  var context = function() {
    return context.finish();
  };

  context.value = value;
  Object.defineProperty(context, 'name', { value: name, enumberable: true });
  context.result = true;
  context.modifier = pass;
  context.strategy = andStrategy;
  context.active = [];
  context.done = [];

  Object.setPrototypeOf(context, assertProto);

  // a hack for
  Object.defineProperty(context, 'length', { value: assertProto.length, enumberable: true });

  return context;
}

var checkProto = {
  // all assertion methods call this one
  // it can also be used to run assertions without adding them globally
  // `check(arg, 'arg').add(new Assertion(...))()`
  add: function(assertionProto, args) {
    var assertion = Object.create(assertionProto);
    assertion.args = args || [];
    this.active.push(assertion);
    var retVal = assertion.runInContext.apply(assertion, [ this ].concat(assertion.args));
    this.active.pop();
    return retVal;
  },
  // `check(arg, 'arg').is.not.Empty.finish()`
  // is just a longer notation of:
  // `check(arg, 'arg').is.not.Empty()`
  finish: function() {
    if (!this.result) {
      throw new Error(buildMessage(this));
    }
    return this.value;
  },
  // to be used inside assertions
  // (I wounder if there is a way to implement this without double IoC)
  assert: function(condition) {
    return this.strategy(condition);
  },
};

// returns currently running assertions
Object.defineProperty(checkProto, 'current', {
  get: function() { return this.active[this.active.length - 1]; },
  enumerable: true,
});

Object.setPrototypeOf(assertProto, checkProto);

// strategies for hangling boolean operators
function andStrategy(condition) {
  this.current.result = this.modifier(condition(this.value));
  this.result = this.result && this.current.result;
  this.current.prefix = 'and ';
  this.done.push(this.current);
  return this;
}
function orStrategy(condition) {
  if (this.done.length !== 0 && this.result === true) {
    // Condition already satisfied, no need to do subsequent checks.
    this.strategy = doneStrategy;
    return this;
  }
  this.current.prefix = 'or ';
  this.result = this.current.result = this.modifier(condition(this.value));
  this.done.push(this.current);
  this.strategy = andStrategy;
  return this;
}
function doneStrategy() {
  return this;
}

// default modifier
function pass(result) {
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
function isNullOrUndefined(value) {
  return value === null || typeof value === 'undefined';
}

// code that builds error message is invoked only when assertion fails
// from this moment, performace is not a concern here
function buildMessage(context) {
  var groupByName = groupByVariableName.bind(null, context);

  // prefix of first group will not be printed
  var toString = function(group) {
    toString = groupToString.bind(null, context);
    group.prefix = '';
    return toString(group);
  };

  var message = context.done
    .reduce(removeDuplicates, [])
    .reduce(groupByName, [])
    .filter(onlyWithNegativeResult)
    .reduce(groupByName, [])
    .reduce(function(builder, group) { return builder + toString(group); }, '');

  return message;
}

function removeDuplicates(result, assertion) {
  if (result.length === 0 ||
      Object.getPrototypeOf(result[result.length - 1]) !== Object.getPrototypeOf(assertion)) {
    result.push(assertion);
  }
  return result;
}

function groupByVariableName(context, result, assertion) {
  var name = assertion.getter.name(context);
  var current = result.length === 0? createGroup(assertion): result.pop();
  var currentName = current.getter.name(context);
  if (name !== currentName) {
    result.push(current);
    current = createGroup(assertion);
  }
  current.message.push(assertion.prefix + ensureArray(assertion.message).join(' '));
  current.result &= assertion.result;
  result.push(current);
  return result;
}

function createGroup(assertion) {
  // has the same properties as assertion
  var group = {
    prefix: assertion.prefix,
    getter: assertion.getter,
    message: [],
    result: true,
  };
  assertion.prefix = '';
  return group;
}

function groupToString(context, group) {
  var name = group.getter.name(context);
  var conditions = group.message.join(' ');
  var value = group.getter.value(context);
  var retVal = group.prefix + name +' must be '+ conditions +'; got '+ value;
  return retVal;
}

function ensureArray(value) {
  return isArray(value)? value: [ value ];
}

function onlyWithNegativeResult(group) {
  return !group.result;
}

/*
  eslint-env node
 */

/*
  global window
 */

