[travis-url]: http://travis-ci.org/webfront-toolkit/offensive.js
[travis-image]: https://api.travis-ci.org/webfront-toolkit/offensive.js

[david-url]: https://david-dm.org/webfront-toolkit/offensive.js
[david-image]: https://david-dm.org/webfront-toolkit/offensive.js.svg

[david-url-dev]: https://david-dm.org/webfront-toolkit/offensive.js#info=devDependencies
[david-image-dev]: https://david-dm.org/webfront-toolkit/offensive.js/dev-status.svg

[npm-url]: https://npmjs.org/package/offensive.js
[npm-image]: https://badge.fury.io/js/offensive.js.svg

# offensive.js

[![Build Status][travis-image]][travis-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-image-dev]][david-url-dev]
[![NPM version][npm-image]][npm-url]

A human-readable, fast boilerplate-free constract programming library
for JavaScript. It enables easy implementation of offensive and defensive
programming techniques. offensive.js is compatible with web browsers
(when used via [browserify][browserify]) and with node.

[browserify]: https://github.com/substack/node-browserify

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

## API

Library doesn't have proper documentation yet :( Please check the [source
code][code] for details about API or [integration tests][integration-tests]
for more advanced examples.

[code]: offensive.js
[integration-tests]: test/integration.coffee

## License

Copyright &copy; 2016 Maciej Chałapuk.
Released under [MIT license](LICENSE).

