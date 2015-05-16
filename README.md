# log-interceptor

  [![NPM Version][npm-img]][npm-url]
  [![Linux Build][travis-img]][travis-url]
  [![Windows Build][appveyor-img]][appveyor-url]
  [![Test Coverage][coveralls-img]][coveralls-url]
  [![Dependency Status][david-img]][david-url]

[npm-img]: https://badge.fury.io/js/log-interceptor.svg
[npm-url]: https://www.npmjs.com/package/log-interceptor
[travis-img]: https://img.shields.io/travis/roeldev/log-interceptor/master.svg?label=linux
[travis-url]: https://travis-ci.org/roeldev/log-interceptor
[appveyor-img]: https://img.shields.io/appveyor/ci/roeldev/log-interceptor/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/roeldev/log-interceptor
[coveralls-img]: https://img.shields.io/coveralls/roeldev/log-interceptor/master.svg
[coveralls-url]: https://coveralls.io/r/roeldev/log-interceptor?branch=master
[david-img]: https://david-dm.org/roeldev/log-interceptor.svg
[david-url]: https://david-dm.org/roeldev/log-interceptor

**Intercepts output from console.log()**

This module is very useful if you want to test the output written to `console.log`. It intercepts the output, allows for a custom callback function to handle the output, and returns all intercepted output when the `end()` function is called.

Inspired by PHP's [Output Control functions][url-php-oc] and the testcase from [`jshint-stylish`][url-test].

## Installation
```sh
npm install --save log-interceptor
```

## How to use
```js
var logInterceptor = require('log-interceptor');

// start intercepting
logInterceptor();

// output to intercept
console.log('log 1');
console.log('log 2');

// end intercepting
var logs   = logInterceptor.end();
var result = ['log 1\n', 'log 2\n'];
```

## API
- [logInterceptor()][api-loginterceptor]
- [logInterceptor.end()][api-loginterceptor-end]
- [logInterceptor.endAll()][api-loginterceptor-endall]


### logInterceptor(options)
Starts the log interceptor. It is possible to auto format the intercepted output by using the following options:

option | type | description
------ | ---- | -----------
passDown | `boolean` | Pass the intercepted output down to the next interceptor, or display it when the first level is reached.
stripColors | `boolean` | Strip colors of the intercepted output.
trimTimestamp | `boolean` | Check if the output starts with a timestamp (`[00:00:00]`). If that's the case, remove it.
trimLinebreak | `boolean` | Trim last linebreak, this will not touch linebreaks somewhere in the middle of the output.
splitOnLinebreaks | `boolean` | Split the output and add multiple entries to the end log. Linebreaks on the end of the output will not be used to split.

By providing your own custom callback function, you can whatever you want with the intercepted output. If you want to display the output, or pass it down to a level below, let the callback function return `true`:
```js
logInterceptor(function(interceptedOutputString)
{
    return true;
});
```

Or if you only want to log the output, but still want to pass it down to the level below:
```js
logInterceptor(true);
```

### logInterceptor.end()
Ends the current intercept session and restores previous one, or the original `process.stdout.write` function. Returns an `array` with intercepted output from `console.log`.

```js
// start intercept and allow to pass down to `process.stdout.write`
logInterceptor(true);

console.log('log 1');
console.log('log 2');

// end intercepting
var logs   = logInterceptor.end();
var result = ['log 1\n', 'log 2\n'];
```

### logInterceptor.endAll()
Ends all intercept sessions and restores the original `process.stdout.write` function. Will return an `array` with all intercepted output from all active sessions that were not already ended.

```js
// level1
logInterceptor();

console.log('log 1');

// level2: pass output down to level1
logInterceptor(true);

console.log('log 2');
console.log('log 3');

// end intercepting
var logs   = logInterceptor.endAll();
var result = [
    ['log 1\n', 'log 2\n', 'log 3\n'],
    ['log 2\n', 'log 3\n']
];
```

[url-php-oc]: http://php.net/manual/en/ref.outcontrol.php
[url-test]: https://github.com/sindresorhus/jshint-stylish/blob/master/test.js

[api-loginterceptor]: #loginterceptorcallbackfn
[api-loginterceptor-end]: #loginterceptorend
[api-loginterceptor-endall]: #loginterceptorendall
