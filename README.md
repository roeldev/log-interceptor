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

Inspired by PHP's [Output Control functions][url-php-oc] and the testcase from [_jshint-stylish_][url-test].


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
- [logInterceptor.write()][api-loginterceptor-write]

### logInterceptor([options][, callbackFn])
Starts the log interceptor. Both the `options` and `callbackFn` arguments are optional. When they are both not specified, the default behavior is to intercept the output and return an array with the [`end()`][api-loginterceptor-end] function.

##### - options
The default options are set in the `logInterceptor.defaultOptions` object. These options are used to auto format the intercepted output, or pass it to a level below. You can override the default values by passing your own object to the function:

option | type | default | description
------ | ---- | --------|------------
passDown | `boolean` | `false` | Pass the intercepted output down to the next level, or display it when the first level is reached.
stripColors | `boolean` | `false` | Strip colors from the intercepted output.
trimTimestamp | `boolean` | `false` | Check if the output starts with a timestamp (`[00:00:00]`). When that's the case, remove it.
trimLinebreak | `boolean` | `false` | Trim last linebreak, this will not touch linebreaks somewhere in the middle of the output.
splitOnLinebreak | `boolean` | `false` | Split the output and add multiple entries to the end log. Linebreaks on the end of the output will not be used to split.

> For more info about the above options, check the associated [utility functions][section-utilityfunctions].

If you want to use the default options, but do want to pass down the intercepted output, you can use the below short version:
```js
logInterceptor(true);
// wich equals
logInterceptor({ 'passDown': true });
```

##### - callbackFn
By providing your own custom callback function, you can do whatever you want with the intercepted output. If you want to display the output (with only one level active), or pass it down to a level below, let the callback function return `true`. If you don't want that, let it return `false`. When you do not return a value, the default value from the `passDown` option is used instead.
```js
var customOutputLog = [];
logInterceptor({ 'trimLinebreak': true }, function(interceptedOutputString)
{
    customOutputLog.push(interceptedOutputString);
    return true;
});
```

### logInterceptor.end()
Ends the current intercept session. Returns an `array` with intercepted output. When no more sessions are active, the original `process.stdout.write` function is restored.

```js
// start intercept and allow to pass down to `process.stdout.write`
logInterceptor(true);

console.log('log 1');
console.log('log 2');

// end intercepting and restore `process.stdout.write`
var logs   = logInterceptor.end();
var result = ['log 1\n', 'log 2\n'];
```

### logInterceptor.endAll()
Ends all intercept sessions and restores the original `process.stdout.write` function. Will return an `array` with all intercepted output from all active sessions that were not already ended, or `false` when no sessions where active.

```js
// level1
logInterceptor();

console.log('log 1');

// level2: pass output down to level1
logInterceptor(true);

console.log('log 2');
console.log('log 3');

// ends intercepting, returns all output and restores `process.stdout.write`
var logs   = logInterceptor.endAll();
var result = [
    ['log 1\n', 'log 2\n', 'log 3\n'],
    ['log 2\n', 'log 3\n']
];
```

### logInterceptor.write(str)
If you do not want a string to be intercepted while _log-interceptor_ is active, use this function. It is basically a bound reference to the original `process.stdout.write`. This means by calling this function, the arguments are send to `process.stdout.write` with `process.stdout` as it's current scope (just like it should when calling the function without _log-interceptor_ changing stuff).


## Utility functions
The utility functions are available in the `logInterceptor.utils` object and in the scope of the callback function wich you can pass to [`logInterceptor()`][api-loginterceptor]. Ofcourse you can also use these functions in your own custom code.

- [stripColor()][utils-stripcolor]
- [trimTimestamp()][utils-trimtimestamp]
- [trimLinebreak()][utils-trimlinebreak]
- [splitOnLinebreak()][utils-splitonlinebreak]

### logInterceptor.utils.stripColor(str)
Strips the Ansi colors from the string with _strip-ansi_ and returns the new string.

### logInterceptor.utils.trimTimestamp(str[, checkColors = true])
Trims timestamps (eg. `[00:00:00]`) from the beginning of the string and returns the new string. When `checkColors` is not `false`, the function will also check for color coded timestamps wich are created with _gulp-util_'s `log` function.

### logInterceptor.utils.trimLinebreak(str)
Trims linebreaks (`\n`) from the end of the string and returns the new string.

### logInterceptor.utils.splitOnLinebreak(str[, trimLineBreaks = false])
Splits the string on linebreaks (`str.split('\n')`) not on the end of the string and returns an array. When `trimLinebreaks` equals `true`, a single linebreak is put back on the end of all array values.


[url-php-oc]: http://php.net/manual/en/ref.outcontrol.php
[url-test]: https://github.com/sindresorhus/jshint-stylish/blob/master/test.js

[section-utilityfunctions]: #utilityfunctions

[api-loginterceptor]: #loginterceptoroptions-callbackfn
[api-loginterceptor-end]: #loginterceptorend
[api-loginterceptor-endall]: #loginterceptorendall
[api-loginterceptor-write]: #loginterceptorwritestr

[utils-stripcolor]: #loginterceptorutilsstripcolorstr
[utils-trimtimestamp]: #loginterceptorutilstrimtimestampstr-checkcolors--true
[utils-trimlinebreak]: #loginterceptorutilstrimlinebreakstr
[utils-splitonlinebreak]: #loginterceptorutilssplitonlinebreakstr-trimlinebreaks--false
