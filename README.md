[travis-url]: http://travis-ci.org/webfront-toolkit/offensive.js
[travis-image]: https://travis-ci.org/webfront-toolkit/offensive.js.svg?branch=master

[david-url]: https://david-dm.org/webfront-toolkit/offensive.js
[david-image]: https://david-dm.org/webfront-toolkit/offensive.js.svg

[david-url-dev]: https://david-dm.org/webfront-toolkit/offensive.js#info=devDependencies
[david-image-dev]: https://david-dm.org/webfront-toolkit/offensive.js/dev-status.svg

[npm-url]: https://npmjs.org/package/offensive
[npm-image]: https://badge.fury.io/js/offensive.svg

# offensive.js
[![Build Status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-image-dev]][david-url-dev]
[![NPM version][npm-image]][npm-url]

A human-readable, fast and boilerplate-free contract programming library
for JavaScript.

**Why would I want it**?

 1. It reduces the boilerplate of writing error messsages to zero,
 2. Provides very intuitive and extensible DSL for writing assertions (zero learning curve),
 3. Enables easy implementation of offensive and defensive techniques,
 4. Is compatible with web browsers (when used via [browserify][browserify])
  and with node ([v0.10][node-v0.10], [v0.12][node-v0.12], [v4.x][node-v4], [v6.x][node-v6]).

[browserify]: https://github.com/substack/node-browserify

[node]: https://github.com/nodejs/node
[node-v0.10]: https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V010.md
[node-v0.12]: https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V012.md
[node-v4]: https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V4.md
[node-v6]: https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V6.md

**Links**:

 * [What is the difference between offensive and defensive
   programming?][defensive-design]

[defensive-design]: http://softwarephilosophy.ninja/defensive-design

## Installation

```shell
npm install --save offensive
```

## Usage

```js
var check = require('offensive');

// A wrapper for `console.log` function that checks is passed argument is a string.
function log(str) {
  console.log(check(str, 'str').is.aString());
}

// Now following erroneus call...
log({});

// ...will result in throwing
// new Error('str must be a string; got [object Object]')
```

## API Reference

### Context

Assertions are implemented as property getters or, if they accept arguments,
as methods. They always return instance of&nbsp;[`OperatorContext`](#operator-context).
This library contain following predefined assertions.

```js
Context.prototype = Object.assign(new Noop(), {
  get Null() { ... }, // aliases: null, Nil, nil
  get Undefined() { ... }, // aliases: undefined
  get Empty() { ... }, // aliases: empty
  get aNumber() { ... },
  get aString() { ... },
  get anObject() { ... },
  get aFunction() { ... },
  get anArray() { ... },
  anInstanceOf: (RequiredClass) => { ... }, // aliases: instanceOf
  property: (propertyName, /* optional */ propertyValue) => { ... }, // aliases: prop
  length: (requiredLength) => { ... }, // aliases: len
  elementThatIs: (index, assertName, condition) => { ... }, // aliases: elementWhichIs
  eachElementIs: (assertName, condition) => { ... },
  get onlyNumbers() { ... },
  get onlyStrings() { ... },
  get onlyObjects() { ... },
  get onlyFunctions() { ... },
  onlyInstancesOf: (RequiredClass) => { ... },
});
```

[null]: #null-assertion
#### Null Assertion
```js
get Null() { ... } // aliases: null, Nil, nil
```
Asserts that checked value is `null` using `===`.
Typically used in combination with [`.not`][not] operator.

```js
check(arg, 'arg').is.not.Null();
```

#### Undefined Assertion
```js
get Undefined() { ... } // aliases: undefined
```
Asserts that checked value is `undefined`.
Typically used in combination with [`.not`][not] operator.

```js
check(arg, 'arg').is.not.Undefined();
```

#### Empty Assertion
```js
get Empty() { ... } // aliases: empty
```
Asserts that checked value is `null` or `undefined`.
Typically used in combination with [`.not`][not] operator.

```js
check(arg, 'arg').is.not.Empty();
```

#### Number Assertion
```js
get aNumber() { ... }
```
Asserts that checked value is a number by ivoking `typeof` operator.

```js
check(arg, 'arg').is.aNumber();
```

#### String Assertion
```js
get aString() { ... }
```
Asserts that checked value is a string by ivoking `typeof` operator.

```js
check(arg, 'arg').is.aString();
```

#### Object Assertion
```js
get anObject() { ... }
```
Asserts that checked value is an object by ivoking `typeof` operator.
Be wary that this will be true also for array instances and `null`.
Use [`.anArray`][array] and [`.Null`][null] in order to test for these
specific cases.

```js
check(arg, 'arg').is.anObject();
```

#### Function Assertion
```js
get aFunction() { ... }
```
Asserts that checked value is a function by ivoking `typeof` operator.

```js
check(arg, 'arg').is.aFunction();
```

[array]: #array-assertion
#### Array Assertion
```js
get anArray() { ... }
```
Asserts that checked value is an array, by performing few
[duck typing][duck-typing] method checks.

[duck-typing]: https://en.wikipedia.org/wiki/Duck_typing

```js
check(arg, 'arg').is.anArray();
```

[instance-of]: #instanceof-assertion
#### InstanceOf Assertion
```js
anInstanceOf: (RequiredClass) => { ... }, // aliases: instanceOf
```
Asserts that checked value is a instance of **RequiredClass**, by
using `instanceof` operator.

```js
check(arg, 'arg').is.anInstanceOf(RegExp);
```

#### Property Assertion
```js
property: (propertyName, /* optional */ propertyValue) => { ... }, // aliases: prop
```
Asserts that checked value has property of name **propertyName**.
It also asserts that value of the property equals **propertyValue**
(if propertyValue is present). It uses `===` operator for comparing values.

```js
check(arg, 'arg').has.property('length');
check(arg, 'arg').contains.property('nodeName', 'DIV');
```

#### Length Assertion
```js
length: (requiredLength) => { ... }, // aliases: len
```
Asserts that checked value has property of name "length" and value
of **requiredLength**.

```js
check(arg, 'arg').has.length(0);
```

[element-that-is]: #elementthatis-assertion
#### ElementThatIs Assertion
```js
elementThatIs: (index, assertName, condition) => { ... }, // aliases: elementWhichIs
```
Asserts that:
 1. Checked value is an array of length at least **`index`**` + 1`,
 2. Element under **index** satisfies **condition**.

**condition** must be an object implementing [`Condition`][condition] interface
or a `function` with signature matching [`Condition.isSatisfiedBy(arg)`][condition]
method. **assertName** is used as assertion name in generated error message.

```js
check(arg, 'arg').has.elementThatIs(0, "an integer", Number.isInteger);
```

[each-element-is]: #eachelementis-assertion
#### EachElementIs Assertion
```js
eachElementIs: (assertName, condition) => { ... },
```
Asserts that:
 1. Checked value is an array,
 2. Each element of this array satisfies **condition**.

**condition** must be an object implementing [`Condition`][condition] interface
or a `function` with signature matching [`Condition.isSatisfiedBy(arg)`][condition]
method. **assertName** is used as assertion name in generated error message.

```js
check(arg, 'arg').eachElementIs("an integer", Number.isInteger);
```

[only-numbers]: #onlynumbers-assertion
#### OnlyNumbers Assertion
```js
get onlyNumbers() { ... },
```
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is a number.

```js
check(arg, 'arg').contains.onlyNumbers();
```

[only-strings]: #onlystrings-assertion
#### OnlyStrings Assertion
```js
get onlyStrings() { ... },
```
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is a string.

```js
check(arg, 'arg').contains.onlyStrings();
```

[only-objects]: #onlyobjects-assertion
#### OnlyObjects Assertion
```js
get onlyObjects() { ... },
```
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is an object.

```js
check(arg, 'arg').contains.onlyObjects();
```

[only-functions]: #onlyfunctions-assertion
#### OnlyFunctions Assertion
```js
get onlyFunctions() { ... },
```
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is a function.

```js
check(arg, 'arg').contains.onlyFunctions();
```

[only-instances-of]: #onlyinstancesof-assertion
#### OnlyInstancesOf Assertion
```js
onlyInstancesOf: (RequiredClass) => { ... },
```
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is an instance of **RequiredClass**.

```js
check(arg, 'arg').contains.onlyInstancesOf(MyClass);
```

### Operator Context

All operators are implemented as property getters. They nevet have arguments
and always return instance of [`Context`](#context).

```js
OperatorContext.prototype = {
  get and() { ... }, // aliases: of, with
  get either() { ... }, // aliases: weather
  get or() { ... },
  get not() { ... }, // aliases: no, dont, doesnt
};
```

#### AND Operator

```js
get and() { ... } // aliases: of, with
```
Logical conjunction of two boolean values which are separated by call to `.and` operator.

```js
check(arg, 'arg').has.length(2).and.contains.onlyNumbers();
```

#### OR Operator
  
```js
get either() { ... } // aliases: weather
get or() { ... }
```
Logical alternative of two values which are separated by call to `.or` operator.
Result of whole expression between `.either` and `.or` is taken as left-hand-side
argument. First result after `.or` is taken as right-hand-side argument.
```js
check(arg, 'arg').is.either.anObject.or.aFunction();
```

[not]: #not-operator
#### NOT Operator

```js
get not() { ... } // aliases: no, dont, doesnt
```

Logical negation of a value after `.not` operator.

```js
check(arg, 'arg').is.not.Undefined();
```

### No Op Methods

Library contains following methods that do nothing.

```js
Noop.prototype = {
  is: () => this,
  be: () => this,
  being: () => this,
  which: () => this,
  that: () => this,
  to: () => this,
  from: () => this,
  under: () => this,
  over: () => this,
  has: () => this,
  have: () => this,
  defines: () => this,
  define: () => this,
  contains: () => this,
  contain: () => this,
  precondition: () => this,
  postcondition: () => this,
  invariant: () => this,
};
```

Example usage:
```js
check(arg, 'arg').is.anObject();
```

### Interfaces

[condition]: #condition
#### Condition

Interface of parameter used in [`.elementThatIs`][element-that-is]
and [`.eachElementIs`][each-element-is] assertions.

```js
interface Condition {
  isSatisfiedBy(value: any): bool;
};
```

## Examples

For more usage examples, check out project's [integration tests][integration-tests].

[integration-tests]: test/integration.coffee

## License

Copyright &copy; 2016 Maciej Chałapuk.
Released under [MIT license](LICENSE).

