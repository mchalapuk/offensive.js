[npm-url]: https://npmjs.org/package/offensive
[npm-image]: https://badge.fury.io/js/offensive.svg

# offensive :facepunch: js

[![NPM version][npm-image]][npm-url]

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
const { contract } = require('offensive');
// or (with all assertions pre-loaded)
const { contract } = require('offensive/all');

// es6-style default import
import contract from 'offensive';
// or (with all assertions pre-loaded)
import contract from 'offensive/all';
```

### Loading Assertions

In order to minimize the bundle payload, each assertion can be imported
separately, either during application bootup or in each file where the specific
assertions are used. The same assertion can be safely imported multiple times
(importing an assertion second time is a no op).

```js
// node-style require
require('offensive/assertions/aString/register');

// es6-style import
import 'offensive/assertions/aString/register';
```

When using the library on server-side, the bundle size is typically of no
concern. For those situations, the library supports loading all assertions at
once.

```js
import 'offensive/assertions/register';
import { contract } from 'offensive';

// or even shorter
import { contract } from 'offensive/all';
```

###

## Usage Examples

### Precondition Checks A.K.A. Offensive Programming

Programming offensively is about throwing exceptions a lot. As soon
as corrupted state or illegal parameter is detected, program is crashed
with a descriptive error message. This technique greatly helps in finding
bugs at&nbsp;their cause.
```js
import 'offensive/assertions/fieldThat/register';
import 'offensive/assertions/aNumber/register';

import contract from 'offensive';

class Point2D {
  /**
   * @param init initializer object containing `x` and `y` properties.
   */
  constructor(init) {
    // Contract is satisfied if init contains
    // `x` and `y` property of type number.
    contract('init', init)
      .has.fieldThat('x', x => x.is.aNumber)
      .and.fieldThat('y', y => y.is.aNumber)
      .throwIfUnmet();
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
contract('init', init).is.anObject.throwIfUnmet();
contract('init.x', init.x).is.aNumber.throwIfUnmet();
contract('init.y', init.y).is.aNumber.throwIfUnmet();
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
import contract from 'offensive';

const app = express();
app.use(bodyParser.json());

// A simple ping service which reflects messages sent to it.
app.post('/ping', function (req, res, next) {
  // Contract is satisfied if body has a message which is a string
  // (.propertyThat is an alias of .fieldThat assertion)
  const error = contract('req.body', req.body)
    .contains.propertyThat('message', message => message.is.aString)
    .getError();
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const { message } = body;
  res.json({ message });
});
```

Above code presents defensive programming on the server side, but the same
technique is applicable in the client. Client-server contract should be tested
both, after receiving request from the client, and after receiving response
from the server.

## API Reference

**Table of Contents**

1. [Contract Function][contract-function]
1. [.throwIfUnmet()][throw-if-unmet]
1. [.getError()][get-error]
1. [Assertions][assertions]
1. [Boolean Operators][operators]
1. [Legacy Call Operator][legacy-call-operator]

[contract-function]: #contract-function
<a id=contract-function></a>
### Contract Function
```js
function contract<T>(varName : string, testedValue : T) : AssertionBuilder<T>;
```
Creates an instance of `AssertionBuilder`. [Methods of returned
instance][assertions] add assertions to the builder. Requested assertions
will be checked against given **testedValue** after [executing assertion
expression][call-operator]. In case some assertions fail, given **name**
will be used as part of error message.
```js
import contract from 'offensive';
...

contract('arg', arg)...
```

[throw-if-unmet]: #throw-if-unmet
<a id=throw-if-unmet></a>
### .throwIfUnmet()
```js
interface AssertionBuilder<T> {
  throwIfUnmet(errorName?: string = 'ContractError') : T;
}
```
Executes built assert expression. Returns **testedValue** if assertion succeeds.
Throws `ContractError` in case it fails. intended for offensive programming.
```js
import 'offensive/assertions/length';
import contract from 'offensive';

contract('arg', arg)
  .has.length(10)
  .throwIfUnmet(); // <- executes built assert expression
```
**NOTE: Assertion will not be run unless this method or `.getError()` is invoked.**

[get-error]: #get-error
<a id=get-error></a>
### .getError()
```js
interface AssertionBuilder<T> {
  getError(errorName?: string = 'ContractError') : string | null;
}
```
Executes built assert expression. Returns error message if assertion fails.
Returns `null` in case it succeeds. Intended for defensive programming.

```js
import 'offensive/assertions/length';
import contract from 'offensive';

const error = contract('arg', arg)
  .has.length(10)
  .getError(); // <- executes built assert expression
```
**NOTE: Assertion will not be run unless this method or `.throwIfUnmet()` is invoked.**

[assertions]: #assertions
### Assertions

offensive.js contains following built-in assertions.

**Table of Contents**

 1. [`.Null`][null]
 1. [`.Undefined`][undefined]
 1. [`.Empty`][empty]
 1. [`.ofType(requiredType)`][of-type]
 1. [`.aBoolean`][boolean]
 1. [`.aNumber`][number]
 1. [`.anInteger`][integer]
 1. [`.aString`][string]
 1. [`.anObject`][object]
 1. [`.aFunction`][function]
 1. [`.anArray`][array]
 1. [`.anInstanceOf(RequiredClass)`][instance-of]
 1. [`.aDate`][date]
 1. [`.aRegExp`][regexp]
 1. [`.True`][true]
 1. [`.False`][false]
 1. [`.truthy`][truthy]
 1. [`.falsy`][falsy]
 1. [`.matches(regexp)`][matches]
 1. [`.anEmail`][email]
 1. [`.anIntegerString`][integer-string]
 1. [`.equalTo`][equal-to]
 1. [`.exactly`][exactly]
 1. [`.lessThan(rightBounds)`][less-than]
 1. [`.lessThanOrEqualTo(rightBounds)`][less-than-or-equal-to]
 1. [`.greaterThan(leftBounds)`][greater-than]
 1. [`.greaterThanOrEqualTo(leftBounds)`][greater-than-or-equal-to]
 1. [`.inRange(leftBounds, rightBounds)`][in-range]
 1. [`.before(rightBounds, boundsVarName?)`][before]
 1. [`.after(leftBounds, boundsVarName?)`][after]
 1. [`.field(fieldName)`][field]
 1. [`.fieldThat(fieldName, condition)`][field-that]
 1. [`.allFieldsThat(condition)`][all-fields-that]
 1. [`.method(methodName)`][method]
 1. [`.length(requiredLength)`][length]
 1. [`.oneOf(set, name)`][one-of]
 1. [`.elementThat(index, assertName, condition)`][element-that]
 1. [`.allElementsThat(assertName, condition)`][all-elements-that]
 1. [`.includes(element)`][includes]
 1. [`.includesAllOf(element)`][includes-all-of]
 1. [`.includesElementThat(condition)`][includes-element-that]

[null]: #null-assertion
<a id=null-assertion></a>
#### `.Null` aliases: `.null`, `.Nil`, `.nil`
Asserts that checked value is `null` using `===`.
Typically used in combination with [`.not`][not] operator.
```js
contract('arg', arg).is.not.Null.throwIfUnmet();
```

[undefined]: #undefined-assertion
<a id=undefined-assertion></a>
#### `.Undefined` aliases: `.undefined`
Asserts that checked value is `undefined`.
Typically used in combination with [`.not`][not] operator.
```js
contract('arg', arg).is.not.Undefined.throwIfUnmet();
```

[empty]: #empty-assertion
<a id=empty-assertion></a>
#### `.Empty` aliases: `.empty`
Asserts that checked value is `null` or `undefined`.
Typically used in combination with [`.not`][not] operator.
```js
contract('arg', arg).is.not.Empty.throwIfUnmet();
```

[of-type]: #of-type-assertion
<a id=of-type-assertion></a>
#### `.ofType(requiredType : string)` aliases: `.type`
Asserts that checked value is of **requiredType** by ivoking `typeof` operator.
```js
contract('arg', arg).is.ofType('boolean').throwIfUnmet();
```

[boolean]: #boolean-assertion
<a id=boolean-assertion></a>
#### `.aBoolean` aliases: `.Boolean`, `.boolean`
Asserts that checked value is a boolean by ivoking `typeof` operator.
```js
contract('arg', arg).is.aBoolean.throwIfUnmet();
```

[number]: #number-assertion
<a id=number-assertion></a>
#### `.aNumber` aliases: `.Number`, `.number`
Asserts that checked value is a number by ivoking `typeof` operator.
```js
contract('arg', arg).is.aNumber.throwIfUnmet();
```

[integer]: #integer-assertion
<a id=integer-assertion></a>
#### `.anInteger` aliases: `.Integer`, `.anInt`, `.int`
Asserts that checked value is an integer by ivoking `Number.isInteger`.
```js
contract('arg', arg).is.anInteger.throwIfUnmet();
```

[string]: #string-assertion
<a id=string-assertion></a>
#### `.aString` aliases: `.String`, `.string`
Asserts that checked value is a string by ivoking `typeof` operator.
```js
contract('arg', arg).is.aString.throwIfUnmet();
```

[object]: #object-assertion
<a id=object-assertion></a>
#### `.anObject` aliases: `.Object`, `.object`
Asserts that checked value is an object by ivoking `typeof` operator.
Be wary that this will be true also for array instances and `null`.
Use [`.anArray`][array] and [`.Null`][null] in order to test for these
specific cases.
```js
contract('arg', arg).is.anObject.throwIfUnmet();
```

[function]: #function-assertion
<a id=function-assertion></a>
#### `.aFunction` aliases: `.Function`, `.function`
Asserts that checked value is a function by ivoking `typeof` operator.
```js
contract('arg', arg).is.aFunction.throwIfUnmet();
```

[array]: #array-assertion
<a id=array-assertion></a>
#### `.anArray` aliases: `.Array`, `.array`
Asserts that checked value is an array by invoking `Array.isArray`.
```js
contract('arg', arg).is.anArray.throwIfUnmet();
```

[instance-of]: #instanceof-assertion
<a id=instanceof-assertion></a>
#### `.anInstanceOf(RequiredClass : Function)` aliases: `.instanceOf`
Asserts that checked value is a instance of **RequiredClass**, by
using `instanceof` operator.
```js
contract('arg', arg).is.anInstanceOf(RegExp).throwIfUnmet();
```

[date]: #date-assertion
<a id=date-assertion></a>
#### `.aDate` aliases: `.Date`, `.date`
Asserts that checked value is a instance of `Date`, by
using `instanceof` operator.
```js
contract('arg', arg).is.aDate.throwIfUnmet();
```

[regexp]: #regexp-assertion
<a id=regexp-assertion></a>
#### `.aRegExp` aliases: `.RegExp`, `.regexp`
Asserts that checked value is a instance of `RegExp`, by
using `instanceof` operator.
```js
contract('arg', arg).is.aRegExp.throwIfUnmet();
```

[true]: #true-assertion
<a id=true-assertion></a>
#### `.True` aliases: `.true`
Asserts that checked value is a boolean of value `true`.
```js
contract('arg', arg).is.True.throwIfUnmet();
```

[false]: #false-assertion
<a id=false-assertion></a>
#### `.False` aliases: `.false`
Asserts that checked value is a boolean of value `false`.
```js
contract('arg', arg).is.False.throwIfUnmet();
```

[truthy]: #truthy-assertion
<a id=truthy-assertion></a>
#### `.truthy` aliases: `.Truthy`, `.truethy`, `.Truethy`
Asserts that checked value is truthy (converts to `true`).
```js
contract('arg', arg).is.truthy.throwIfUnmet();
```

[falsy]: #falsy-assertion
<a id=falsy-assertion></a>
#### `.falsy` aliases: `.Falsy`, `.falsey`, `.Falsey`
Asserts that checked value is falsy (converts to `false`).
```js
contract('arg', arg).is.falsy.throwIfUnmet();
```

[matches]: #matches-assertion
<a id=matches-assertion></a>
#### `.matches(regexp : RegExp)` aliases: `.matchesRegexp`, `.matchesRegExp`
Asserts that checked value fully matches given **regexp**.
```js
contract('arg', arg).matches(/[a-z]+/).throwIfUnmet();
```

[email]: #email-assertion
<a id=email-assertion></a>
#### `.anEmail` aliases: `.Email`, `.email`
Asserts that checked value is a valid email.
```js
contract('arg', arg).is.anEmail();
```

[integer-string]: #integer-string-assertion
<a id=integer-string-assertion></a>
#### `.anIntegerString` aliases: `.IntegerString`, `.intString`
Asserts that checked value is a valid string form of an integer.
```js
contract('arg', arg).is.anIntegerString.throwIfUnmet();
```

[equal-to]: #equal-to-assertion
<a id=equal-to-assertion></a>
#### `.equalTo(another : any)` aliases: `.equal`, `.equals`
Asserts that checked value is equal to **another**.
Comparison is made with `==` (double equals) operator.
```js
contract('arg', arg).is.equalTo(100).throwIfUnmet();
```

[exactly]: #exactly-assertion
<a id=exactly-assertion></a>
#### `.exactly(another : any)`
Asserts that checked value is exactly the same as **another**.
Comparison is made with `===` (triple equals) operator.
```js
contract('arg', arg).is.exactly(instance).throwIfUnmet();
```

[less-than]: #less-than-assertion
<a id=less-than-assertion></a>
#### `.lessThan(rightBounds : number)` aliases: `.lt`, `.less`
Asserts that checked value is less than **rightBounds**.
```js
contract('arg', arg).is.lessThan(100).throwIfUnmet();
```

[less-than-or-equal-to]: #less-than-or-equal-to-assertion
<a id=less-than-or-equal-to-assertion></a>
#### `.lessThanOrEqualTo(rightBounds : number)` aliases: `.lte`, `.lessThanEqual`
Asserts that checked value is less than or equal to **rightBounds**.
```js
contract('arg', arg).is.lessThanOrEqualTo(100).throwIfUnmet();
```

[greater-than]: #greater-than-assertion
<a id=greater-than-assertion></a>
#### `.greaterThan(leftBounds : number)` aliases: `.gt`, `.greater`
Asserts that checked value is greater than **leftBounds**.
```js
contract('arg', arg).is.greaterThan(0).throwIfUnmet();
```

[greater-than-or-equal-to]: #greater-than-or-equal-to-assertion
<a id=greater-than-or-equal-to-assertion></a>
#### `.greaterThanOrEqualTo(leftBounds : number)` aliases: `.gte`, `.greaterThanEqual`
Asserts that checked value is greater than or equal to **leftBounds**.
```js
contract('arg', arg).is.greaterThanOrEqualTo(0).throwIfUnmet();
```

[in-range]: #in-range-assertion
<a id=in-range-assertion></a>
#### `.inRange(leftBounds : number, rightBounds : number)` aliases: `.between`
Asserts that checked value is grater than or equal to **leftBounds**
and less than **rightBounds**.
```js
contract('arg', arg).is.inRange(0, 100).throwIfUnmet();
```

[before]: #before
<a id=before-assertion></a>
#### `.before(rightBounds : Date, boundsVarName ?: string)`
Asserts that checked value a Date chronologically before **rightBounds**.
```js
contract('arg', arg).is.before(new Date(0), 'Epoch').throwIfUnmet();
```

[after]: #after
<a id=after-assertion></a>
#### `.after(leftBounds : Date, boundsVarName ?: string)`
Asserts that checked value a Date chronologically after **leftBounds**.
```js
contract('arg', arg).is.after(new Date(0), 'Epoch').throwIfUnmet();
```

[field]: #field-assertion
<a id=field-assertion></a>
#### `.field(fieldName : string)` aliases: `.property`
Asserts that checked value has field of name **propertyName**.
```js
contract('arg', arg).has.property('length').throwIfUnmet();
```

[field-that]: #field-that-assertion
<a id=field-that-assertion></a>
#### `.fieldThat(fieldName : string, builder : FieldAssertionBuilder)`

Asserts that checked value has field of name **propertyName**, which satisfied
assertion created in gived **builder**.
```js
contract('arg', arg)
  .has.propertyThat('x', x => x.is.aNumber)
  .throwIfUnmet();
```

[all-fields-that]: #all-fields-that-assertion
<a id=all-fields-that-assertion></a>
#### `.allFieldsThat(builder : FieldAssertionBuilder)`
Asserts that:
 1. Checked value is not null or undefined,
 2. Value of each field of this object satisfies assertuin created
   by given **builder**.

```js
contract('arg', arg)
  .has.allFieldsThat(field => field.is.aNumber)
  .throwIfUnmet();
```

[method]: #method-assertion
<a id=method-assertion></a>
#### `.method(methodName : string)`
Asserts that checked value has field of name **methodName** which is a function.
```js
contract('arg', arg).has.method('toString').throwIfUnmet();
```

[length]: #length-assertion
<a id=length-assertion></a>
#### `.length(requiredLength : number)` aliases: `.len`
Asserts that checked value has property of name "length" and value
of **requiredLength**.
```js
contract('arg', arg).has.length(0).throwIfUnmet();
```

[one-of]: #one-of-assertion
<a id=one-of-assertion></a>
#### `.oneOf(set : any[], name ?: string)` aliases: `.elementOf`, `.containedIn`
Asserts that checked value is contained in given **set**. Given **name** (if
present) is used as a name of set in produced error message.
```js
contract('arg', arg)
  .is.oneOf([ 'started', 'running', 'finished' ])
  .throwIfUnmet();

// or (with set name used in the error message)
contract('arg', arg)
  .is.oneOf([ 'started', 'running', 'finished' ], 'valid status')
  .throwIfUnmet();
```

[element-that]: #element-that-assertion
<a id=element-that-assertion></a>
#### `.elementThat(index : number, builder : ElemAssertionBuilder)` aliases: `.elementWhichIs`
Asserts that:
 1. Checked value is an array of length at least **`index`**` + 1`,
 2. Element under **index** satisfies assertion created by given **builder**.
```js
contract('arg', arg)
  .has.elementThat(0, elem => elem.is.anInteger)
  .throwIfUnmet();
```

[all-elements-that]: #all-elements-that-assertion
<a id=all-elements-that-assertion></a>
#### `.allElementsThat(builder : ElemAssertionBuilder)` aliases: `.allElementsWhich`
Asserts that:
 1. Checked value is an array,
 2. Each element of this array satisfies assertion created by given **builder**.

```js
contract('arg', arg)
  .has.allElementsThat(elem => elem.is.anInteger)
  .throwIfUnmet();
```

[includes]: #includes-assertion
<a id=includes-assertion></a>
#### `.includes(element : any)` aliases: `.contains`
Asserts that:
 1. Checked value is an array,
 2. The array contains given **element**.

```js
contract('arg', arg)
  .has.includes(elem)
  .throwIfUnmet();
```

[includes-all-of]: #includes-all-of-assertion
<a id=includes-all-of-assertion></a>
#### `.includesAllOf(elements : any[])` aliases: `.includesAll`
Asserts that:
 1. Checked value is an array,
 2. The array contains all elements of **elements**.

```js
contract('categories', categories)
  .has.includesAlOf(['functional', 'performance'])
  .throwIfUnmet();
```

[includes-element-that]: #includes-element-that-assertion
<a id=includes-element-that-assertion></a>
#### `.includesElementThat(builder: ElemAssertionBuilder)` aliases: `.includesElement`
Asserts that:
 1. Checked value is an array,
 2. The array contains at least one element that satisfies assertion created by
    given **builder**.

```js
contract('arg', arg)
  .includesElementThat(elem => elem.is.anInteger)
  .throwIfUnmet();
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
contract('arg', arg)
  .has.length(2)
  .and.allElementsThat(elem => elem.is.aNumber)
  .throwIfUnmet();
```

[or]: #or-operator
<a id=or-operator></a>
#### `.or()`
Logical alternative of two (or more) values which are separated by call to `.or`
operator.
```js
contract('arg', arg)
  .is.anObject.or.aFunction
  .throwIfUnmet();
```

[not]: #not-operator
<a id=not-operator></a>
#### `.not` aliases: `.no`, `.dont`, `.doesnt`
Logical negation of an assertion after `.not` operator.
```js
contract('arg', arg).is.not.Undefined.throwIfUnmet();
```

[legacy-call-operator]: #legacy-call-operator
<a id=legacy-call-operator></a>
### Legacy Call Operator
```js
interface AssertionBuilder<T> {
  () : T;
}
```
Alias for [`.throwIfUnmet()`][throw-if-unmet].

```js
import 'offensive/assertions/aString';
import contract from 'offensive';

contract('arg', arg).is.aString.throwIfUnmet(); // <- executes the expression
contract('arg', arg).is.aString(); // <- the same but with a call operator
```

The call operator was the only way to execute an offensive expression until
version 2. Initially, it was seen as an elegant API with the least amount of
boilerplate possible. While this is true for all assertions without arguments,
assertions with arguments have their own call operator. This led to situations
where two consecutive call operators were needed in order to execute
the expression.

```js
import 'offensive/assertions/length';
import contract from 'offensive';

contract('arg', arg).has.length(3)(); // <- double call operators weirdness
contract('arg', arg).has.length(3).throwIfUnmet(); // <- this looks much better
```

[`.throwIfUnmet()`][throw-if-unmet] (introduced in version 3) solves the problem
of readability and adds a bit of explicitness at the cost of a little bit more
code. The call operator is still supported for backwards compatilibity.

## Extension API

offensive.js is extensible, but extension API is not documented yet.
If you wish to write an extension, take a look at the implementation
of [built-in assertions][assertions-code], [operators][operators-code]
and also at the interface of [`Registry`][registry-code] class.

[assertions-code]: src/assertions
[operators-code]: src/operators
[registry-code]: src/Registry.ts

## License

Copyright &copy; 2016 - 2022 Maciej Chałapuk.
Released under [MIT license](LICENSE).

