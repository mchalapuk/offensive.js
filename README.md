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

**Why would I want it?**

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

## Installation

```shell
npm install --save offensive
```

## Usage

### Offensive Programming

Programming offensively is about throwing exceptions a lot. As soon
as corrupted state or illegal parameter is detected, program is crashed
with a descriptive error message. This technique greatly helps in finding
bugs at&nbsp;their cause.
```js
var check = require('offensive');

// Let's say that we have a Time class
// with a contract that argument must have
// a timestamp property of type number.
function Time(init) {
  check(init, 'init').is.anObject();
  check(init.timestamp, 'init.timestamp').is.aNumber();

  ...
}
```
Now, following erroneus call...
```js
new Time({});
```
...will result in throwing following exception.
```
ContractError: init.timestamp must be a numer; got undefined
  at Object.aNumber (node_modules/offensive/lib/registry/assertion.js:59:21)
  at Time (example.js:9:24)
  at example.js:20:0
```

### Defensive Programming

Offensive programming is not applicable when collaborating with
external components. We don't want our program to crash in response
to a bug in another program. Logging an error and trying to correct
it or simply ignoring erroneus input would be a better way of
handling such situation.
```js
// Now, let's create a function that fetches time data
// from a time server and returns instance of Time.
function fetchTime(url, callback) {
  check(url, 'url').is.anInstanceOf(URL);
  check(callback, 'callback').is.aFunction();
  
  var json = "";

  http.get(url.toString(), (res) => {
    res.on('data', (chunk) => { json += chunk; });
    res.on('end', parseAndReturn);
    res.resume();
  });
  
  function parseAndReturn() {
    var init = JSON.parse(json);
    
    // JSON received from the server may not fulfill our contract.
    // In order to prevent crashing, we need to validate this
    // external input before constructing an instance of Time.
    var context = check.defensive(init, 'init from '+ url).is.anObject;
    if (context._result) {
      context = check.defensive(init.timestamp, 'init.timestamp from '+ url).is.aNumber;
    }
    if (!context._result) {
      log(context._message);
      callback(context._message);
      return 
    }

    callback(null, new Time(init));
  });
}
```

**Further Rading:**
 * [What is the difference between offensive and defensive
   programming?][defensive-design]

[defensive-design]: http://softwarephilosophy.ninja/defensive-design

## API Reference

**Table of Contents**

1. [Check Function][check]
1. [Assertions][assertions]
2. [Boolean Operators][operators]
3. [Interfaces][interfaces]

[check]: #check-function
<a id=check-function></a>
### Check Function
```js
module.exports = function check(value, name) { ... }
```
Creates a [`Context`][context] object. All [assertions][assertions]
called on returned context will be applied to passed **value**.
In case some assertions fail, **name** will be used as part of
error message.
```js
var check = require('offensive');
...

check(arg, 'arg')...
```

[assertions]: #assertions
### Assertions

offensive.js contains following built-in assertions.

**Table of Contents**

 1. [`.Null()`][null]<br>
 1. [`.Undefined()`][undefined]<br>
 1. [`.Empty()`][empty]<br>
 1. [`.aNumber()`][number]<br>
 1. [`.aString()`][string]<br>
 1. [`.anObject()`][object]<br>
 1. [`.aFunction()`][function]<br>
 1. [`.anArray()`][array]<br>
 1. [`.anInstanceOf(RequiredClass)`][instance-of]<br>
 1. [`.property(propertyName, propertyValue)`][property]<br>
 1. [`.length(requiredLength)`][length]<br>
 1. [`.elementThatIs(index, assertName, condition)`][element]<br>
 1. [`.eachElementIs(assertName, condition)`][each-element]<br>
 1. [`.onlyNumbers()`][only-numbers]<br>
 1. [`.onlyStrings()`][only-strings]<br>
 1. [`.onlyObjects()`][only-objects]<br>
 1. [`.onlyFunctions()`][only-functions]<br>
 1. [`.onlyInstancesOf(RequiredClass)`][only-instances-of]<br>

[null]: #null-assertion
<a id=null-assertion></a>
#### `.Null()` aliases: `.null`, `.Nil`, `.nil`
Asserts that checked value is `null` using `===`.
Typically used in combination with [`.not`][not] operator.
```js
check(arg, 'arg').is.not.Null();
```

[undefined]: #undefined-assertion
<a id=undefined-assertion></a>
#### `.Undefined()` aliases: `.undefined`
Asserts that checked value is `undefined`.
Typically used in combination with [`.not`][not] operator.
```js
check(arg, 'arg').is.not.Undefined();
```

[empty]: #empty-assertion
<a id=empty-assertion></a>
#### `.Empty()` aliases: `.empty`
Asserts that checked value is `null` or `undefined`.
Typically used in combination with [`.not`][not] operator.
```js
check(arg, 'arg').is.not.Empty();
```

[number]: #number-assertion
<a id=number-assertion></a>
#### `.aNumber()` aliases: `.Number`, `.number`
Asserts that checked value is a number by ivoking `typeof` operator.
```js
check(arg, 'arg').is.aNumber();
```

[string]: #string-assertion
<a id=string-assertion></a>
#### `.aString()` aliases: `.String`, `.string`
Asserts that checked value is a string by ivoking `typeof` operator.
```js
check(arg, 'arg').is.aString();
```

[object]: #object-assertion
<a id=object-assertion></a>
#### `.anObject()` aliases: `.Object`, `.object`
Asserts that checked value is an object by ivoking `typeof` operator.
Be wary that this will be true also for array instances and `null`.
Use [`.anArray`][array] and [`.Null`][null] in order to test for these
specific cases.
```js
check(arg, 'arg').is.anObject();
```

[function]: #function-assertion
<a id=function-assertion></a>
#### `.aFunction()` aliases: `.Function`, `.function`
Asserts that checked value is a function by ivoking `typeof` operator.
```js
check(arg, 'arg').is.aFunction();
```

[array]: #array-assertion
<a id=array-assertion></a>
#### `.anArray()` aliases: `.Array`, `.array`
Asserts that checked value is an array, by performing few
[duck typing][duck-typing] method checks.
```js
check(arg, 'arg').is.anArray();
```
[duck-typing]: https://en.wikipedia.org/wiki/Duck_typing

[instance-of]: #instanceof-assertion
<a id=instanceof-assertion></a>
#### `.anInstanceOf(RequiredClass)` aliases: `.instanceOf`
Asserts that checked value is a instance of **RequiredClass**, by
using `instanceof` operator.
```js
check(arg, 'arg').is.anInstanceOf(RegExp);
```

[property]: #property-assertion
<a id=property-assertion></a>
#### `.property(propertyName, propertyValue)` aliases: `.prop`
Asserts that checked value has property of name **propertyName**.
It also asserts that value of the property equals **propertyValue**
(if propertyValue is present). It uses `===` operator for comparing values.
```js
check(arg, 'arg').has.property('length');
check(arg, 'arg').contains.property('nodeName', 'DIV');
```

[length]: #length-assertion
<a id=length-assertion></a>
#### `.length(requiredLength)` aliases: `.len`
Asserts that checked value has property of name "length" and value
of **requiredLength**.
```js
check(arg, 'arg').has.length(0);
```

[element]: #elementthatis-assertion
<a id=elementthatis-assertion></a>
#### `.elementThatIs(index, assertName, condition)` aliases: `.elementWhichIs`
Asserts that:
 1. Checked value is an array of length at least **`index`**` + 1`,
 2. Element under **index** satisfies **condition**.

**condition** must be an object implementing [`Condition`][condition] interface
or a `function` with signature matching [`Condition.isSatisfiedBy(arg)`][condition]
method. **assertName** is used as assertion name in generated error message.
```js
check(arg, 'arg').has.elementThatIs(0, "an integer", Number.isInteger);
```

[each-element]: #eachelementis-assertion
<a id=eachelementis-assertion></a>
#### `.eachElementIs(assertName, condition)`
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
<a id=onlynumbers-assertion></a>
#### `.onlyNumbers()`
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is a number.
```js
check(arg, 'arg').contains.onlyNumbers();
```

[only-strings]: #onlystrings-assertion
<a id=onlystrings-assertion></a>
#### `.onlyStrings()`
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is a string.
```js
check(arg, 'arg').contains.onlyStrings();
```

[only-objects]: #onlyobjects-assertion
<a id=onlyobjects-assertion></a>
#### `.onlyObjects()`
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is an object.
```js
check(arg, 'arg').contains.onlyObjects();
```

[only-functions]: #onlyfunctions-assertion
<a id=onlyfunctions-assertion></a>
#### `.onlyFunctions()`

Asserts that:
 1. Checked value is an array,
 2. Each element of this array is a function.
```js
check(arg, 'arg').contains.onlyFunctions();
```

[only-instances-of]: #onlyinstancesof-assertion
<a id=onlyinstancesof-assertion></a>
#### `.onlyInstancesOf(RequiredClass)`
Asserts that:
 1. Checked value is an array,
 2. Each element of this array is an instance of **RequiredClass**.
```js
check(arg, 'arg').contains.onlyInstancesOf(MyClass);
```

[operators]: #boolean-operators
### Boolean Operators

offensive.js implements following operators.

**Table of Contents**

1. [`.and`][and]
1. [`.or`][or]
1. [`.not`][not]

[and]: #and-operator
<a id=and-operator></a>
#### `.and` aliases: `.of`, `.with`
Logical conjunction of two boolean values which are separated by call to `.and` operator.
```js
check(arg, 'arg').has.length(2).and.contains.onlyNumbers();
```

[or]: #or-operator
<a id=or-operator></a>
#### `.either()` aliases: `.weather`
#### `.or()`
Logical alternative of two values which are separated by call to `.or` operator.
Result of whole expression between `.either` and `.or` is taken as left-hand-side
argument. First result after `.or` is taken as right-hand-side argument.
```js
check(arg, 'arg').is.either.anObject.or.aFunction();
```

[not]: #not-operator
<a id=not-operator></a>
#### `.not` aliases: `.no`, `.dont`, `.doesnt`
Logical negation of a value after `.not` operator.
```js
check(arg, 'arg').is.not.Undefined();
```

[interfaces]: #interfaces
### Interfaces

**Table of Contents**

1. [`Noop`][noop]
1. [`Context`][context]
1. [`OperatorContext`][operator-context]
1. [`Condition`][condition]

[noop]: #noop
#### Noop

Contains property getters that do nothing and return [`Context`][context].
```js
interface Noop {
  get is(): Context,
  get be(): Context,
  get being(): Context,
  get which(): Context,
  get that(): Context,
  get to(): Context,
  get from(): Context,
  get under(): Context,
  get over(): Context,
  get has(): Context,
  get have(): Context,
  get defines(): Context,
  get define(): Context,
  get contains(): Context,
  get contain(): Context,
  get precondition(): Context,
  get postcondition(): Context,
  get invariant(): Context,
};
```

[context]: #context
#### Context

Contains [assertion methods][assertions]. All assertion methods return [`OperatorContext`][operator-context]. Parameterized assertions are implemented as&nbsp;methods, assertions without parameters as property getters.
```js
interface Context extends Noop {
  get Null(): OperatorContext,
  get Undefined(): OperatorContext,
  get Empty(): OperatorContext,
  get aNumber(): OperatorContext,
  get aString(): OperatorContext,
  get anObject(): OperatorContext,
  get aFunction(): OperatorContext,
  get anArray(): OperatorContext,
  anInstanceOf(RequiredClass): OperatorContext,
  property(propertyName, propertyValue): OperatorContext,
  length(requiredLength): OperatorContext,
  elementThatIs(index, assertName, condition): OperatorContext,
  eachElementIs(assertName, condition): OperatorContext,
  get onlyNumbers(): OperatorContext,
  get onlyStrings(): OperatorContext,
  get onlyObjects(): OperatorContext,
  get onlyFunctions(): OperatorContext,
  onlyInstancesOf(RequiredClass): OperatorContext,
});
```

[operator-context]: #operator-context
#### Operator Context

Contains [operator methods][operators]. All operators are implemented as property getters and return [`Context`][context].
```js
interface OperatorContext{
  get and(): Context,
  get either(): Context,
  get or(): Context,
  get not(): Context,
};
```
[condition]: #condition
#### Condition

Interface of parameter used in [`.elementThatIs`][element]
and [`.eachElementIs`][each-element] assertions.
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

