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

**Why would I want to use it?**
 1. Reduces the boilerplate of writing error messsages to zero,
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

## API

Library doesn't have proper documentation yet :( Please check the [source
code][code] for details about API and [integration tests][integration-tests]
for more advanced examples.

[code]: offensive.js
[integration-tests]: test/integration.coffee

## License

Copyright &copy; 2016 Maciej Chałapuk.
Released under [MIT license](LICENSE).

