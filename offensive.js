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
  'empty': new Assertion(function(context) {
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

function check(value, name) {
  var context = function() {
    return context.finish();
  };
  context.value = value;
  Object.defineProperty(context, 'name', { value: name, enumberable: true });
  Object.defineProperty(context, 'length', { value: assertProto.length, enumberable: true });
  context.result = true;
  context.modifier = pass;
  context.strategy = beginStrategy;
  context.active = [];
  context.done = [];

  Object.setPrototypeOf(context, assertProto);

  return context;
}

var checkProto = {
  add: function(assertionProto, args) {
    var assertion = Object.create(assertionProto);
    this.active.push(assertion);
    var retVal = assertion.runInContext.apply(assertion, [ this ].concat(args || []));
    this.active.pop();
    return retVal;
  },
  assert: function(condition) {
    return this.strategy(condition);
  },
  finish: function() {
    if (!this.result) {
      throw new Error(buildMessage(this));
    }
    return this.value;
  },
};

Object.defineProperty(checkProto, 'current', {
  get: function() { return this.active[this.active.length - 1]; },
  enumerable: true,
});

Object.setPrototypeOf(assertProto, checkProto);

function beginStrategy(condition) {
  this.result = this.current.result = this.modifier(condition(this.value));
  this.done.push(this.current);
  this.strategy = andStrategy;
  return this;
}
function andStrategy(condition) {
  this.current.result = this.modifier(condition(this.value));
  this.result &= this.current.result;
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
  return beginStrategy.call(this, condition);
}
function doneStrategy() {
  return this;
}

function pass(result) {
  return result;
}

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

function buildMessage(context) {
  var messages = [];
  var values = [];

  var done = context.done.reduce(removeDuplicates, []);
  extractMessagesAndValues(context, done, messages, values);

  var finalMessage = '';
  messages.forEach(function(message, i) {
    finalMessage += message +'; got '+ values[i];
  });
  return finalMessage;
}

function extractMessagesAndValues(context, assertionsDone, messages, values) {
  var currentName = null;
  var currentMessage = '';
  var currentValue = null;
  var currentResult = true;

  function flush() {
    if (!currentResult) {
      messages.push(currentMessage);
      values.push(currentValue);
    }
  }

  assertionsDone.forEach(function(assertion, i) {
    var name = assertion.getter.name(context);
    if (name !== currentName) {
      flush();

      currentName = name;
      currentMessage = (i? ' ': '') + assertion.prefix + name +' must be';
      currentValue = assertion.getter.value(context);
      currentResult = true;
      assertion.prefix = '';
    }
    currentMessage += ' '+ assertion.prefix + ensureArray(assertion.message).join(' ');
    currentResult &= assertion.result;
  });

  flush();
}

function removeDuplicates(result, assertion) {
  if (result.length === 0 ||
      Object.getPrototypeOf(result[result.length - 1]) !== Object.getPrototypeOf(assertion)) {
    result.push(assertion);
  }
  return result;
}

function ensureArray(value) {
  return isArray(value)? value: [ value ];
}

/*
  eslint-env node
 */

/*
  global window
 */

