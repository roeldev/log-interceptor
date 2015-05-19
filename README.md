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


## Config options
These options can be used to change the default behavior of a _log-interceptor_ session. You can use it in the [`logInterceptor()`][api-loginterceptor] or [`logInterceptor.config()`][api-loginterceptor-config] functions.

option | type | default | description
------ | ---- | --------|------------
passDown | `boolean` | `false` | Pass the intercepted output down to the next level, or display it when the first level is reached.
stripColors | `boolean` | `false` | Strip colors from the intercepted output.
trimTimestamp | `boolean` | `false` | Check if the output starts with a timestamp (`[00:00:00]`). When that's the case, remove it.
trimLinebreak | `boolean` | `false` | Trim last linebreak, this will not touch linebreaks somewhere in the middle of the output.
splitOnLinebreak | `boolean` | `false` | Split the output and add multiple entries to the end log. Linebreaks on the end of the output will not be used to split.

> For more info about the above options, check the associated [utility functions][section-utilityfunctions].


## API
- [logInterceptor()][api-loginterceptor]
- [logInterceptor.config()][api-loginterceptor-config]
- [logInterceptor.end()][api-loginterceptor-end]
- [logInterceptor.endAll()][api-loginterceptor-endall]
- [logInterceptor.write()][api-loginterceptor-write]

### logInterceptor([options][, callbackFn])
Starts the log interceptor. Both the `options` and `callbackFn` arguments are optional. When they are both not specified, the default behavior is to intercept the output and return an array with the [`end()`][api-loginterceptor-end] function.

- <h4>options</h4>
<table>
<tr><td>Type</td><td><code>object</code> or <code>boolean</code></td></tr>
</table>
The default options are set in the `logInterceptor.defaultOptions` object. These options are used to auto format the intercepted output, or pass it to a level below. You can override the default values by passing your own object.

- <h4>callbackFn</h4>
<table>
<tr><td>Type</td><td colspan=2><code>function</code></td></tr>
<tr><td>Arguments</td><td><code>string</code></td><td>originalStr</td></tr>
<tr><td></td><td><code>array</code></td><td>formattedStr</td></tr>
</table>
By providing your own custom callback function, you can do whatever you want with the intercepted output. The callback function accepts two arguments. The first will be the original intercepted output string. The 2nd a formatted version of that same intercepted string, but as an array.


If you want to display the output (with only one level active), or pass it down to a level below, let the callback function return `true`. If you don't want that, let it return `false`. When you do not return a value, the default value from the `passDown` option is used instead.

Example of how to pass down intercepted output to a lower level:
```js
logInterceptor(true);
// wich equals
logInterceptor({ 'passDown': true });
// but also equals
logInterceptor(function()
{
    return true;
});
```

Example of how you might use a custom callback function:
```js
var customOutputLog = [];
logInterceptor({ 'trimLinebreak': true }, function(str)
{
    customOutputLog.push(str);
    return true;
});
```

### logInterceptor.config(option[, value = true])
Allows for custom config options to be set to the default config object.

- <h4>option</h4>
<table>
<tr><td>Type</td><td><code>string</code> or <code>object</code></td></tr>
</table>
When _option_ is a string, it will be added as the key to the object, with the value of _value_. When it's an object, it will be used to extend the default config object.

- <h4>value</h4>
<table>
<tr><td>Type</td><td><code>boolean</code></td></tr>
<tr><td>Default</td><td><code>true</code></td></tr>
</table>
_Value_ will only be used when _option_ is a string. When not set, it defaults to `true`.

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

- <h4>str</h4>
<table>
<tr><td>Type</td><td><code>string</code></tr>
</table>
The string to write.


## Utility functions
The utility functions are available in the `logInterceptor.utils` object and in the scope of the callback function wich you can pass to [`logInterceptor()`][api-loginterceptor]. Ofcourse you can also use these functions in your own custom code.

- [utils.stripColor()][utils-stripcolor]
- [utils.trimTimestamp()][utils-trimtimestamp]
- [utils.trimLinebreak()][utils-trimlinebreak]
- [utils.splitOnLinebreak()][utils-splitonlinebreak]

### utils.stripColor(str)
Strips the Ansi colors from the string with _strip-ansi_ and returns the new string.

- <h4>str</h4>
<table>
<tr><td>Type</td><td><code>string</code></tr>
</table>
The string to strip the colors from.

### utils.trimTimestamp(str[, checkColors = true])
Trims timestamps (eg. `[00:00:00]`) from the beginning of the string and returns the new string. When `checkColors` is not `false`, the function will also check for color coded timestamps wich are created with _gulp-util_'s `log` function.

- <h4>str</h4>
<table>
<tr><td>Type</td><td><code>string</code></tr>
</table>
The string to trim the timestamp from.

- <h4>checkColors</h4>
<table>
<tr><td>Type</td><td><code>boolean</code></tr>
<tr><td>Default</td><td><code>true</code></tr>
</table>
Set to `false` if you do not want to check for color coded timestamps.

### utils.trimLinebreak(str)
Trims linebreaks (`\n`) from the end of the string and returns the new string.

- <h4>str</h4>
<table>
<tr><td>Type</td><td><code>string</code></tr>
</table>
The string to trim the linebreak(s) from.

### utils.splitOnLinebreak(str[, trimLineBreaks = false])
Splits the string on linebreaks (`str.split('\n')`) not on the end of the string and returns an array. When `trimLinebreaks` equals `true`, a single linebreak is put back on the end of all array values.

- <h4>str</h4>
<table>
<tr><td>Type</td><td><code>string</code></tr>
</table>
The string to split on linebreak(s).

- <h4>trimLinebreaks</h4>
<table>
<tr><td>Type</td><td><code>boolean</code></tr>
<tr><td>Default</td><td><code>false</code></tr>
</table>
Set to `true` if you want to add a single linebreak back to the end of the split lines.


[url-php-oc]: http://php.net/manual/en/ref.outcontrol.php
[url-test]: https://github.com/sindresorhus/jshint-stylish/blob/master/test.js

[section-utilityfunctions]: #utilityfunctions

[api-loginterceptor]: #loginterceptoroptions-callbackfn
[api-loginterceptor-config]: #loginterceptorconfigoption-value--true
[api-loginterceptor-end]: #loginterceptorend
[api-loginterceptor-endall]: #loginterceptorendall
[api-loginterceptor-write]: #loginterceptorwritestr

[utils-stripcolor]: #utilsstripcolorstr
[utils-trimtimestamp]: #utilstrimtimestampstr-checkcolors--true
[utils-trimlinebreak]: #utilstrimlinebreakstr
[utils-splitonlinebreak]: #utilssplitonlinebreakstr-trimlinebreaks--false
