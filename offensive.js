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
  this.message = [];
}

Assertion.prototype = {
  getter: getters.value,
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
    this.message = getTypePrefix(requiredType) + requiredType;
    context.assert(function(value) {
      return typeof value === requiredType;
    });
  });
}

TypeofAssertion.prototype = new Assertion();

var builtInAssertions = {
  // does nothing
  'is': new Assertion(function(context) {
    return context;
  }),
  'be': new Alias('is'),
  'being': new Alias('is'),
  'it': new Alias('is'),
  'with': new Alias('is'),
  'which': new Alias('is'),
  'that': new Alias('is'),
  'to': new Alias('is'),
  'of': new Alias('is'),
  'from': new Alias('is'),
  'has': new Alias('is'),
  'have': new Alias('is'),
  'defines': new Alias('is'),
  'define': new Alias('is'),
  'contains': new Alias('is'),
  'contain': new Alias('is'),
  'precondition': new Alias('is'),
  'postcondition': new Alias('is'),
  'invariant': new Alias('is'),

  // boolean operators (and is default)
  'and': new Alias('is'),

  'not': new Assertion(function(context) {
    context.push();
    context.state.strategy = notStrategy;

    function notStrategy(condition) {
      context.current.message = [ 'not' ].concat(ensureArray(context.current.message));
      context.current.result = !condition(context.value);
      this.result = context.current.result;
      context.pop();
    }
  }),

  // either and or must be used in combination
  'either': new Assertion(function(context) {
    context.push();
    context.state.insideEither = true;
  }),
  'weather': new Alias('either'),
  'or': new Assertion(function(context) {
    if (!context.state.insideEither) {
      throw new Error('.or used without .either');
    }
    context.state.strategy = function orStrategy(condition) {
      context.current.result = condition(context.value);
      this.result = this.result || context.current.result;
      context.pop();
      context.current.prefix = 'or ';
    };
  }),

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

// exported check function
function check(value, name) {
  var context = function() {
    return context.finish();
  };

  context.value = value;
//  context.name = name;
  context.state = new State();
  context.stack = [];
  context.current = null;

  Object.setPrototypeOf(context, assertProto);

  // hacks for things that magically happen in v8
  // even though prototype Function.prototype is detached
  Object.defineProperty(context, 'name', { value: name, enumberable: true });
  Object.defineProperty(context, 'length', { value: assertProto.length, enumberable: true });

  return context;
}

var checkProto = {
  // all assertion methods call this one
  // it can also be used to run assertions without adding them globally
  // `check(arg, 'arg').add(new Assertion(...))()`
  add: function(assertionName, assertionProto, args) {
    var assertion = Object.create(assertionProto);
    assertion.name = assertionName;
    assertion.args = args || [];
    assertion.done = [];
    this.state.done.push(assertion);

    var previous = this.current;
    this.current = assertion;
    assertion.runInContext.apply(assertion, [ this ].concat(assertion.args));
    this.current = previous;
    this.finish();
    return this;
  },
  // `check(arg, 'arg').is.not.Empty.finish()`
  // is just a longer notation of:
  // `check(arg, 'arg').is.not.Empty()`
  finish: throwOrReturnValue,
  // to be used inside assertions
  // (I wounder if there is a way to implement this without double IoC)
  assert: function(condition) {
    this.state.strategy(condition, this);
    return this.state.result;
  },
  push: function() {
    this.stack.push(this.state);
    this.state = new State();
    this.state.done = this.current.done;
    this.finish = justReturnValue;
  },
  pop: function() {
    var result = this.state.result;
    this.state = this.stack.pop();
    this.state.strategy(function() { return result; }, this);
    if (this.stack.length === 0) {
      this.finish = throwOrReturnValue;
    }
  },
};

// to be used inside assertions (for precondition checking)
Object.defineProperty(checkProto, 'result', {
  get: function() { return this.state.result; },
  set: function() { throw new Error('.result is a read-only shorthand for .state.result'); },
});

Object.setPrototypeOf(assertProto, checkProto);

// this gets pushed around alot
function State() {
  this.done = [];
  this.result = true;
}

State.prototype = {
  strategy: andStrategy,
};

// strategies for hangling boolean operators
function andStrategy(condition, context) {
  context.current.result = condition(context.value);
  this.result = this.result && context.current.result;
  context.current.prefix = 'and ';
}

// finish functions
function throwOrReturnValue() {
  if (!this.state.result) {
    throw new Error(buildMessage(this));
  }
  return this.value;
}
function justReturnValue() {
  return this.value;
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
function buildMessage(context) {
  var groupByName = groupByVariableName.bind(null, context);
  var toString = groupToString(context);

  var message = context.state.done
//    .map(tee.bind(null, pipe(function(arg) { return arg.done; }, console.log)))
    .reduce(tryReplaceEmptyWithChildren, [])
//    .map(tee.bind(null, console.log))
    .filter(onlyNotEmpty)
    .reduce(removeDuplicates, [])
    .reduce(groupByName, [])
    .filter(onlyWithNegativeResult)
    .reduce(groupByName, [])
    .reduce(function(builder, group) { return builder + toString(group); }, '');

  return message;
}

function onlyNotEmpty(assertion) {
  return typeof assertion.result !== 'undefined';
}

function removeDuplicates(retVal, assertion) {
  if (retVal.length === 0 || retVal[retVal.length - 1].message !== assertion.message) {
    retVal.push(assertion);
  }
  return retVal;
}

function tryReplaceEmptyWithChildren(retVal, group) {
  if (group.message && group.message.length !== 0) {
    retVal.push(group);
  } else {
    group.done.reduce(tryReplaceEmptyWithChildren, retVal);
  }
  return retVal;
}

function groupByVariableName(context, retVal, assertion) {
  var name = assertion.getter.name(context);
  var current = retVal.length === 0? createGroup(assertion): retVal.pop();
  var currentName = current.getter.name(context);
  if (name !== currentName) {
    retVal.push(current);
    current = createGroup(assertion);
  }
  current.message.push(assertion.prefix + ensureArray(assertion.message).join(' '));
  current.result &= assertion.result;
  retVal.push(current);
  return retVal;
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

function groupToString(context) {
  var toString = first;

  function impl(group) {
    var name = group.getter.name(context);
    var conditions = group.message.join(' ');
    var value = group.getter.value(context);
    var retVal = group.prefix + name +' must be '+ conditions +'; got '+ value;
    return retVal;
  }
  function first(group) {
    toString = next;
    group.prefix = '';
    return impl(group);
  }
  function next(group) {
    return ' '+ impl(group);
  }

  return function(group) {
    return toString(group);
  };
}

function ensureArray(value) {
  return isArray(value)? value: [ value ];
}

function onlyWithNegativeResult(group) {
  return !group.result;
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

