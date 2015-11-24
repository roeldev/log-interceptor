/**
 * log-interceptor | test/index_tests.js
 */
'use strict';

var Assert         = require('assert');
var LogInterceptor = require('../lib/index.js');

// -----------------------------------------------------------------------------

LogInterceptor._config = {
    'passDown':         false,
    'stripColor':       false,
    'trimTimestamp':    false,
    'trimLinebreak':    false,
    'splitOnLinebreak': false
};

// // // // // // // // // // // // // // // // // // // // // // // // // // //

describe('LogInterceptor()', function logInterceptorTests()
{
    it('intercept output from console.log and display it', function()
    {
        LogInterceptor(function()
        {
            return true;
        });

        console.log('test1');

        Assert.deepEqual(LogInterceptor.end(), ['test1\n']);
    });

    it('intercept output from console.log [1]', function()
    {
        LogInterceptor(false);

        console.log('test1');
        console.log('test2');

        Assert.deepEqual(LogInterceptor.end(), ['test1\n', 'test2\n']);
    });

    it('intercept output from console.log [2]', function()
    {
        LogInterceptor({ 'trimLinebreak': true });

        console.log('test1');
        console.log('test2');

        Assert.deepEqual(LogInterceptor.endAll(), [['test1', 'test2']]);
    });

    it('intercept and execute the callback function [1]', function()
    {
        var $expected = [];
        LogInterceptor(function($str)
        {
            $expected.push($str);
        });

        console.log('test1');
        console.log('test2');

        Assert.deepEqual(LogInterceptor.end(), $expected);
    });

    it('intercept and execute the callback function [2]', function()
    {
        var $expected = [];
        LogInterceptor({ 'trimLinebreak': true }, function($str, $str2)
        {
            $expected.push($str2[0]);
        });

        console.log('test1');
        console.log('test2');

        Assert.deepEqual(LogInterceptor.end(), $expected);
    });

    it('intercept and not execute the callback var ', function()
    {
        LogInterceptor({}, false);

        console.log('test1');
        console.log('test2');

        Assert.deepEqual(LogInterceptor.endAll(), [['test1\n', 'test2\n']]);
    });

    it('intercept on multiple levels', function()
    {
        // level 1
        LogInterceptor();
        console.log('test1');

        // level 2
        LogInterceptor(function()
        {
            // pass the intercepted string to the below level
            return true;
        });

        console.log('test2');
        console.log('test3');

        LogInterceptor.end(); // end level 2
        Assert.deepEqual(LogInterceptor.end(),
                         ['test1\n', 'test2\n', 'test3\n']);
    });

    it('intercept on multiple levels, passdown and catch all', function()
    {
        // level 1
        LogInterceptor();

        // level 2
        LogInterceptor(true);

        console.log('test1');

        // level 3
        LogInterceptor(true);

        console.log('test2');
        console.log('test3');

        var $actual = LogInterceptor.endAll();

        Assert.deepEqual($actual, [
            ['test1\n', 'test2\n', 'test3\n'],
            ['test1\n', 'test2\n', 'test3\n'],
            ['test2\n', 'test3\n']
        ]);
    });
});

describe('LogInterceptor._debug()', function logInterceptorDebugTests()
{
    it('write the debug message', function()
    {
        var $logInterceptorWriter = LogInterceptor.write;
        var $actual;

        // temporary overwrite write function
        LogInterceptor.write = function($str)
        {
            $actual = $str;
        };

        LogInterceptor._debug('debug', 'test');

        // restore original write function
        LogInterceptor.write = $logInterceptorWriter;

        Assert.strictEqual($actual, 'debug, test\n');
    });
});

describe('LogInterceptor.config()', function logInterceptorConfigTests()
{
    it('add the option to the default config [1]', function()
    {
        LogInterceptor.config('test', true);

        Assert.strictEqual(LogInterceptor._config.test, true);
    });

    it('add the option to the default config [2]', function()
    {
        delete LogInterceptor._config.test;

        LogInterceptor.config('test', 1);

        Assert.strictEqual(LogInterceptor._config.test, true);
    });

    it('add the option to the default config [3]', function()
    {
        delete LogInterceptor._config.test;

        LogInterceptor.config('test');

        Assert.strictEqual(LogInterceptor._config.test, true);
    });

    it('add the option to the default config [4]', function()
    {
        delete LogInterceptor._config.test;

        LogInterceptor.config('test', false);

        Assert.strictEqual(LogInterceptor._config.test, false);
    });

    it('extend the default config', function()
    {
        LogInterceptor._config = {
            'passDown':         false,
            'stripColor':       false,
            'trimTimestamp':    false,
            'trimLinebreak':    false,
            'splitOnLinebreak': false
        };

        LogInterceptor.config({ 'stripColor': true, 'test': 'test' });

        Assert.deepEqual(LogInterceptor._config, {
            'passDown':         false,
            'stripColor':       true,
            'trimTimestamp':    false,
            'trimLinebreak':    false,
            'splitOnLinebreak': false,
            'test':             'test'
        });
    });

    it('return true on success', function()
    {
        delete LogInterceptor._config.test;

        Assert.strictEqual(LogInterceptor.config('test', true), true);
    });

    it('return false on failure', function()
    {
        Assert.strictEqual(LogInterceptor.config(false), false);
    });
});

describe('LogInterceptor.end()', function logInterceptorEndTests()
{
    it('return false when no session to end', function()
    {
        Assert.strictEqual(LogInterceptor.end(), false);
    });
});

describe('LogInterceptor.endAll()', function logInterceptorEndAllTests()
{
    it('return false when no sessions to end', function()
    {
        Assert.strictEqual(LogInterceptor.endAll(), false);
    });
});
