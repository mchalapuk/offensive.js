[travis-url]: http://travis-ci.org/mchalapuk/offensive.js
[travis-image]: https://travis-ci.org/mchalapuk/offensive.js.svg?branch=master

[david-url]: https://david-dm.org/mchalapuk/offensive.js
[david-image]: https://david-dm.org/mchalapuk/offensive.js.svg

[david-url-dev]: https://david-dm.org/mchalapuk/offensive.js?type=dev

[npm-url]: https://npmjs.org/package/offensive
[npm-image]: https://badge.fury.io/js/offensive.svg

# offensive :facepunch: js

[![Build Status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![NPM version][npm-image]][npm-url]
[<img align=right alt="devDependency Status" src="https://david-dm.org/mchalapuk/offensive.js/dev-status.svg">][david-url-dev]

> A human-readable, fast and boilerplate-free contract programming library
for JavaScript.

**Why would I want it?**

 1. It reduces the boilerplate of writing assertion messsages to zero,
 1. Provides very **intuitive and extensible DSL for writing assertions**,
 1. Low core bundle size (22.5kB minified) and a way of bundling only needed assertions,
 1. Has zero runtime dependencies which greatly increases package security,
 1. It's TypeScript-friendly (contains its own `.d.ts` files).

## Installation

```shell
npm install --save offensive
```

### Loading The Library

```js
// node-style require
const { check } = require('offensive');

// es6-style default import
import check from 'offensive';
```

### Loading Assertions

In order to minimize bundle payload, each assertion must be imported separately. It can be done during application bootup or in each file where specific assertion is used (importing an assertion multiple times is harmless).

```js
// node-style require
require('offensive/assertions/aString/register');

// es6-style default import
import 'offensive/assertions/aString/register';
```

## Usage Examples

### Precondition Checks A.K.A. Offensive Programming

Programming offensively is about throwing exceptions a lot. As soon
as corrupted state or illegal parameter is detected, program is crashed
with a descriptive error message. This technique greatly helps in finding
bugs at&nbsp;their cause.
```js
import 'offensive/assertions/fieldThat/register';
import 'offensive/assertions/aNumber/register';

import check from 'offensive';

class Point2D {
  /**
   * @param init initializer object containing `x` and `y` properties.
   */
  constructor(init) {
    // Contract is satisfied if init contains
    // `x` and `y` property of type number.
    check(init, 'init')
      .has.fieldThat('x', x => x.is.aNumber)
      .and.fieldThat('y', y => y.is.aNumber)
      ();
    this.x = init.x;
    this.y = init.y;
  }
}
```
Now, following erroneus call...
```js
const point = new Point2D({ x: 'a', y: null });
```
...will result in throwing following exception.
```
ContractError: init.x must be a number (got 'a') and init.y be a number (got null)
  at operatorContext (offensives/ContextFactory.js:34:33)
  at new Point2D (example.js:16:7)
  at Object.<anonymous> (example.js:22:15)
```

Alternatively, above contract could be implemented using multiple checks, but
the error would only contain information about first failed check.

```js
check(init, 'init').is.anObject();
check(init.x, 'init.x').is.aNumber();
check(init.y, 'init.y').is.aNumber();
```

Above examples use only [`.anObject`][object], [`.aNumber`][number]
and [`.fieldThat`][field-that] assertions.

**[See full list of offensive.js built-in assertions][assertions]**.

### Defensive Programming

Offensive programming is not applicable when collaborating with
external components. A program should not crash in&nbsp;response
to a bug in another program. Logging an error and trying to correct
it by using default value or simply ignoring erroneus input
would be a&nbsp;better way of handling such cases.

#### Ping Server

Following example is a fully functional HTTP-based ping server
implemented using [express.js][express] with defensive checks
on&nbsp;HTTP request implemented using [offensive.js][offensive].

[express]: https://github.com/expressjs/express
[offensive]: https://github.com/mchalapuk/offensive.js

```js
import * as express from 'express';
import * as bodyParser from 'body-parser';

import 'offensive/assertions/aString/register';
import 'offensive/assertions/fieldThat/register';
import check from 'offensive';

const app = express();
app.use(bodyParser.json());

// A simple ping service which reflects messages sent to it.
app.post('/ping', function (req, res, next) {
  try {
    // Contract is satisfied if body has a message which is a string
    // (.propertyThat is an alias of .fieldThat assertion)
    check(req.body, 'req.body')
      .contains.propertyThat('message', message => message.is.aString)();

    const { message } = body;
    res.json({ message });

  } catch (e) {
    // In case contract is not satisfied, an instance
    // of ContractError will be passed to next middleware.
    next(e);
  }
});

// Error handling middleware.
app.use(function (err, req, res, next) {

  // Failed offensive.js assertions can be easily differentiated
  // from other errors by checking error name.
  switch (err.name) {
    case 'ContractError':
      // In case its an assertion from offensive.js
      // HTTP status which indicates a client error is apropriate.
      res.status(400);
      // Could also be HTTP 412 Precondition Failed
      // in case there's a need of being more specific.

      // It's safe to reveil error message in response
      // as it doesn't contain information about the contract
      // and not about the implementation.
      const { name, message } = err;
      res.json({ error: `${name}: ${message}` });

      break;
    default:
      // Any other error will result in HTTP 500 Internal Server Error.
      res.status(500);
      res.json({ 'error': 'InternalServerError: ${err.name}' });
      break;
  }
});
```

Above code presents defensive programming on the server side, but the same
technique is applicable in the client. Client-server contract should be tested
both, after receiving request from the client, and after receiving response
from the server.

## API Reference

**Table of Contents**

1. [Check Function][check-function]
1. [Call Operator][call-operator]
1. [Assertions][assertions]
1. [Boolean Operators][operators]

[check-function]: #check-function
<a id=check-function></a>
### Check Function
```js
function check<T>(testedValue : T, varName : string) : AssertionBuilder<T>;
```
Creates an instance of `AssertionBuilder`. [Methods of returned
instance][assertions] add assertions to the builder. Requested assertions
will be checked against given **testedValue** after [executing assertion
expression][call-operator]. In case some assertions fail, given **name**
will be used as part of error message.
```js
import check from 'offensive';
...

check(arg, 'arg')...
```

[call-operator]: #call-operator
### Call Operator
```js
interface AssertionBuilder<T> {
  () : T;
}
```
Executes built assert expression. Returns **testedValue** if assertion succeeds.
Throws `ContractError` in case it fails.
```js
import 'offensive/assertions/length';
import check from 'offensive';

check(arg, 'arg')
  .has.length(10)
  (); // <- executes built assert expression
```
**NOTE: Assertion will not be run unless call operator is invoked.**

[assertions]: #assertions
### Assertions

offensive.js contains following built-in assertions.

**Table of Contents**

 1. [`.Null()`][null]
 1. [`.Undefined()`][undefined]
 1. [`.Empty()`][empty]
 1. [`.ofType(requiredType)`][of-type]
 1. [`.aBoolean()`][boolean]
 1. [`.aNumber()`][number]
 1. [`.anInteger()`][integer]
 1. [`.aString()`][string]
 1. [`.anObject()`][object]
 1. [`.aFunction()`][function]
 1. [`.anArray()`][array]
 1. [`.anInstanceOf(RequiredClass)`][instance-of]
 1. [`.aDate()`][date]
 1. [`.aRegExp()`][regexp]
 1. [`.True()`][true]
 1. [`.False()`][false]
 1. [`.truthy()`][truthy]
 1. [`.falsy()`][falsy]
 1. [`.matches(regexp)`][matches]
 1. [`.anEmail()`][email]
 1. [`.anIntegerString()`][integer-string]
 1. [`.equalTo()`][equal-to]
 1. [`.exactly()`][exactly]
 1. [`.lessThan(rightBounds)`][less-than]
 1. [`.lessThanOrEqualTo(rightBounds)`][less-than-or-equal-to]
 1. [`.greaterThan(leftBounds)`][greater-than]
 1. [`.greaterThanOrEqualTo(leftBounds)`][greater-than-or-equal-to]
 1. [`.inRange(leftBounds, rightBounds)`][in-range]
 1. [`.before(rightBounds, boundsVarName?)`][before]
 1. [`.after(leftBounds, boundsVarName?)`][after]
 1. [`.field(fieldName)`][field]
 1. [`.fieldThat(fieldName)`][field-that]
 1. [`.allFieldsThat(condition)`][all-fields-that]
 1. [`.method(methodName)`][method]
 1. [`.length(requiredLength)`][length]
 1. [`.oneOf(set, name)`][one-of]
 1. [`.elementThat(index, assertName, condition)`][element-that]
 1. [`.allElementsThat(assertName, condition)`][all-elements-that]

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

[of-type]: #of-type-assertion
<a id=of-type-assertion></a>
#### `.ofType(requiredType : string)` aliases: `.type`
Asserts that checked value is of **requiredType** by ivoking `typeof` operator.
```js
check(arg, 'arg').is.ofType('boolean')();
```

[boolean]: #boolean-assertion
<a id=boolean-assertion></a>
#### `.aBoolean()` aliases: `.Boolean`, `.boolean`
Asserts that checked value is a boolean by ivoking `typeof` operator.
```js
check(arg, 'arg').is.aBoolean();
```

[number]: #number-assertion
<a id=number-assertion></a>
#### `.aNumber()` aliases: `.Number`, `.number`
Asserts that checked value is a number by ivoking `typeof` operator.
```js
check(arg, 'arg').is.aNumber();
```

[integer]: #integer-assertion
<a id=integer-assertion></a>
#### `.anInteger()` aliases: `.Integer`, `.anInt`, `.int`
Asserts that checked value is an integer by ivoking `Number.isInteger`.
```js
check(arg, 'arg').is.anInteger();
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
Asserts that checked value is an array by invoking `Array.isArray`.
```js
check(arg, 'arg').is.anArray();
```

[instance-of]: #instanceof-assertion
<a id=instanceof-assertion></a>
#### `.anInstanceOf(RequiredClass : Function)` aliases: `.instanceOf`
Asserts that checked value is a instance of **RequiredClass**, by
using `instanceof` operator.
```js
check(arg, 'arg').is.anInstanceOf(RegExp)();
```

[date]: #date-assertion
<a id=date-assertion></a>
#### `.aDate()` aliases: `.Date`, `.date`
Asserts that checked value is a instance of `Date`, by
using `instanceof` operator.
```js
check(arg, 'arg').is.aDate();
```

[regexp]: #regexp-assertion
<a id=regexp-assertion></a>
#### `.aRegExp()` aliases: `.RegExp`, `.regexp`
Asserts that checked value is a instance of `RegExp`, by
using `instanceof` operator.
```js
check(arg, 'arg').is.aRegExp();
```

[true]: #true-assertion
<a id=true-assertion></a>
#### `.True()` aliases: `.true`
Asserts that checked value is a boolean of value `true`.
```js
check(arg, 'arg').is.True();
```

[false]: #false-assertion
<a id=false-assertion></a>
#### `.False()` aliases: `.false`
Asserts that checked value is a boolean of value `false`.
```js
check(arg, 'arg').is.False();
```

[truthy]: #truthy-assertion
<a id=truthy-assertion></a>
#### `.truthy()` aliases: `.Truthy`, `.truethy`, `.Truethy`
Asserts that checked value is truthy (converts to `true`).
```js
check(arg, 'arg').is.truthy();
```

[falsy]: #falsy-assertion
<a id=falsy-assertion></a>
#### `.falsy()` aliases: `.Falsy`, `.falsey`, `.Falsey`
Asserts that checked value is falsy (converts to `false`).
```js
check(arg, 'arg').is.falsy();
```

[matches]: #matches-assertion
<a id=matches-assertion></a>
#### `.matches(regexp : RegExp)` aliases: `.matchesRegexp`, `.matchesRegExp`
Asserts that checked value fully matches given **regexp**.
```js
check(arg, 'arg').matches(/[a-z]+/)();
```

[email]: #email-assertion
<a id=email-assertion></a>
#### `.anEmail()` aliases: `.Email`, `.email`
Asserts that checked value is a valid email.
```js
check(arg, 'arg').is.anEmail();
```

[integer-string]: #integer-string-assertion
<a id=integer-string-assertion></a>
#### `.anIntegerString()` aliases: `.IntegerString`, `.intString`
Asserts that checked value is a valid string form of an integer.
```js
check(arg, 'arg').is.anIntegerString();
```

[equal-to]: #equal-to-assertion
<a id=equal-to-assertion></a>
#### `.equalTo(another : any)` aliases: `.equal`, `.equals`
Asserts that checked value is equal to **another**.
Comparison is made with `==` (double equals) operator.
```js
check(arg, 'arg').is.equalTo(100)();
```

[exactly]: #exactly-assertion
<a id=exactly-assertion></a>
#### `.exactly(another : any)`
Asserts that checked value is exactly the same as **another**.
Comparison is made with `===` (triple equals) operator.
```js
check(arg, 'arg').is.exactly(instance)();
```

[less-than]: #less-than-assertion
<a id=less-than-assertion></a>
#### `.lessThan(rightBounds : number)` aliases: `.lt`, `.less`
Asserts that checked value is less than **rightBounds**.
```js
check(arg, 'arg').is.lessThan(100)();
```

[less-than-or-equal-to]: #less-than-or-equal-to-assertion
<a id=less-than-or-equal-to-assertion></a>
#### `.lessThanOrEqualTo(rightBounds : number)` aliases: `.lte`, `.lessThanEqual`
Asserts that checked value is less than or equal to **rightBounds**.
```js
check(arg, 'arg').is.lessThanOrEqualTo(100)();
```

[greater-than]: #greater-than-assertion
<a id=greater-than-assertion></a>
#### `.greaterThan(leftBounds : number)` aliases: `.gt`, `.greater`
Asserts that checked value is greater than **leftBounds**.
```js
check(arg, 'arg').is.greaterThan(0)();
```

[greater-than-or-equal-to]: #greater-than-or-equal-to-assertion
<a id=greater-than-or-equal-to-assertion></a>
#### `.greaterThanOrEqualTo(leftBounds : number)` aliases: `.gte`, `.greaterThanEqual`
Asserts that checked value is greater than or equal to **leftBounds**.
```js
check(arg, 'arg').is.greaterThanOrEqualTo(0)();
```

[in-range]: #in-range-assertion
<a id=in-range-assertion></a>
#### `.inRange(leftBounds : number, rightBounds : number)` aliases: `.between`
Asserts that checked value is grater than or equal to **leftBounds**
and less than **rightBounds**.
```js
check(arg, 'arg').is.inRange(0, 100)();
```

[before]: #before
<a id=before-assertion></a>
#### `.before(rightBounds : Date, boundsVarName ?: string)`
Asserts that checked value a Date chronologically before **rightBounds**.
```js
check(arg, 'arg').is.before(new Date(0), 'Epoch')();
```

[after]: #after
<a id=after-assertion></a>
#### `.after(leftBounds : Date, boundsVarName ?: string)`
Asserts that checked value a Date chronologically after **leftBounds**.
```js
check(arg, 'arg').is.after(new Date(0), 'Epoch')();
```

[field]: #field-assertion
<a id=field-assertion></a>
#### `.field(fieldName : string)` aliases: `.property`
Asserts that checked value has field of name **propertyName**.
```js
check(arg, 'arg').has.property('length')();
```

[field-that]: #field-that-assertion
<a id=field-that-assertion></a>
#### `.fieldThat(fieldName : string, builder : FieldAssertionBuilder)`

Asserts that checked value has field of name **propertyName**, which satisfied
assertion created in gived **builder**.
```js
check(arg, 'arg').has.propertyThat('x', x => x.is.aNumber)();
```

[all-fields-that]: #all-fields-that-assertion
<a id=all-fields-that-assertion></a>
#### `.allFieldsThat(builder : FieldAssertionBuilder)`
Asserts that:
 1. Checked value is not null or undefined,
 2. Value of each field of this object satisfies assertuin created
   by given **builder**.

```js
check(arg, 'arg').has.allFieldsThat(field => field.is.aNumber)();
```

[method]: #method-assertion
<a id=method-assertion></a>
#### `.method(methodName : string)`
Asserts that checked value has field of name **methodName** which is a function.
```js
check(arg, 'arg').has.method('toString')();
```

[length]: #length-assertion
<a id=length-assertion></a>
#### `.length(requiredLength : number)` aliases: `.len`
Asserts that checked value has property of name "length" and value
of **requiredLength**.
```js
check(arg, 'arg').has.length(0)();
```

[one-of]: #one-of-assertion
<a id=one-of-assertion></a>
#### `.oneOf(set : any[], name ?: string)` aliases: `.elementOf`, `.containedIn`
Asserts that checked value is contained in given **set**. Given **name** (if
present) is used as a name of set in produced error message.
```js
check(arg, 'arg').is.oneOf([ 'started', 'running', 'finished' ])();
check(arg, 'arg')
  .is.oneOf([ 'started', 'running', 'finished' ], 'valid status')
  ();
```

[element-that]: #element-that-assertion
<a id=element-that-assertion></a>
#### `.elementThat(index : number, builder : ElemAssertionBuilder)` aliases: `.elementWhichIs`
Asserts that:
 1. Checked value is an array of length at least **`index`**` + 1`,
 2. Element under **index** satisfies assertion created by given **builder**.
```js
check(arg, 'arg').has.elementThat(0, elem => elem.is.anInteger)();
```

[all-elements-that]: #all-elements-that-assertion
<a id=all-elements-that-assertion></a>
#### `.allElementThat(builder : ElemAssertionBuilder)` aliases: `.allElementsWhich`
Asserts that:
 1. Checked value is an array,
 2. Each element of this array satisfies assertuin created by given **builder**.

```js
check(arg, 'arg').has.allElementsThat(elem => elem.is.anInteger)();
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
Logical conjunction of two boolean values which are separated by call to `.and`
operator.
```js
check(arg, 'arg')
  .has.length(2)
  .and.allElementsThat(elem => elem.is.aNumber)
  ();
```

[or]: #or-operator
<a id=or-operator></a>
#### `.or()`
Logical alternative of two (or more) values which are separated by call to `.or`
operator.
```js
check(arg, 'arg').is.anObject.or.aFunction();
```

[not]: #not-operator
<a id=not-operator></a>
#### `.not` aliases: `.no`, `.dont`, `.doesnt`
Logical negation of an assertion after `.not` operator.
```js
check(arg, 'arg').is.not.Undefined();
```

## Extension API

offensive.js is extensible, but extension API is not documented yet.
If you wish to write an extension, take a look at the implementation
of [built-in assertions][assertions-code], [operators][operators-code]
and also at the interface of [`Registry`][registry-code] class.

[assertions-code]: src/assertions
[operators-code]: src/operators
[registry-code]: src/Registry.ts

## License

Copyright &copy; 2016 - 2019 Maciej Chałapuk.
Released under [MIT license](LICENSE).

