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
  get Empty() { ... }, // aliases: empty
  get Undefined() { ... }, // aliases: undefined
  get aNumber() { ... },
  get aString() { ... },
  get anObject() { ... },
  get aFunction() { ... },
  get anArray() { ... },
  property: (propertyName, propertyValue) => { ... }, // aliases: prop
  length: (requiredLength) => { ... }, // aliases: len
  elementIs: (index, assertName, assertFunction) => { ... },
  get onlyNumbers() { ... },
  get onlyStrings() { ... },
  get onlyObjects() { ... },
  get onlyFunctions() { ... },
  onlyInstancesOf: (RequiredClass) => { ... },
});
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

### Operator Context

All operators are implemented as property getters. They nevet have arguments
and always return instance of [`Context`](#context).

```js
OperatorContext.prototype = {
  get and: () => { ... }, // aliases: of, with
  get either: () => { ... }, // aliases: weather
  get or: () => { ... },
  get not: () => { ... }, // aliases: no, dont, doesnt
};
```

#### AND Operator

```js
get and: () => { ... } // aliases: of, with
```
Logical conjunction of two boolean values which are separated by call to `.and` operator.

```js
check(arg, 'arg').has.length(2).and.contains.onlyNumbers();
```

#### OR Operator
  
```js
get either: () => { ... } // aliases: weather
get or: () => { ... }
```
Logical alternative of two values which are separated by call to `.or` operator.
Result of whole expression between `.either` and `.or` is taken as left-hand-side
argument. First result after `.or` is taken as right-hand-side argument.
```js
check(arg, 'arg').is.either.anObject.or.aFunction();
```

#### NOT Operator

```js
get not: () => { ... } // aliases: no, dont, doesnt
```

Logical negation of a value after `.not` operator.

```js
check(arg, 'arg').is.not.Undefined();
```

## Examples

For more usage examples, check out project's [integration tests][integration-tests].

[integration-tests]: test/integration.coffee

## License

Copyright &copy; 2016 Maciej Chałapuk.
Released under [MIT license](LICENSE).

