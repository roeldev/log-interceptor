/**
 * log-interceptor | test/main.js
 * file version: 0.00.003
 */
'use strict';

var Assert         = require('assert');
var Chalk          = require('chalk');
// var Level          = require('../lib/level.js');
var LogInterceptor = require('../lib/index.js');
var Utils          = LogInterceptor.utils;

////////////////////////////////////////////////////////////////////////////////

describe('LogInterceptor()', function logInterceptorTests()
{
    it('should intercept output from console.log and display it', function()
    {
        LogInterceptor(function()
        {
            return true;
        });

        console.log('test1');

        Assert.deepEqual(LogInterceptor.end(), ['test1\n']);
    });

    it('should intercept output from console.log [1]', function()
    {
        LogInterceptor(false);

        console.log('test1');
        console.log('test2');

        Assert.deepEqual(LogInterceptor.end(), ['test1\n', 'test2\n']);
    });

    it('should intercept output from console.log [2]', function()
    {
        LogInterceptor({});

        console.log('test1');
        console.log('test2');

        Assert.deepEqual(LogInterceptor.endAll(), ['test1\n', 'test2\n']);
    });

    it('should intercept and execute the callback function', function()
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

    it('should intercept on multiple levels', function()
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

    it('should intercept on multiple levels, passdown and catch all', function()
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

        Assert.deepEqual(LogInterceptor.endAll(),
        [
            ['test1\n', 'test2\n', 'test3\n'],
            ['test1\n', 'test2\n', 'test3\n'],
            ['test2\n', 'test3\n']
        ]);
    });
});

describe('LogInterceptor.end()', function logInterceptorEndTests()
{
    it('should return false when no session to end', function()
    {
        Assert.strictEqual(LogInterceptor.end(), false);
    });
});

describe('LogInterceptor.endAll()', function logInterceptorEndAllTests()
{
    it('should return false when no sessions to end', function()
    {
        Assert.strictEqual(LogInterceptor.endAll(), false);
    });
});

describe('Utils.stripColor()', function utilsStripColorTests()
{
    it('should strip the colors', function()
    {
        var $input = Chalk.red('test');

        Assert.strictEqual(Utils.stripColor($input), 'test');
    });

    it('should return the exact same string', function()
    {
        var $input = 'test';

        Assert.strictEqual(Utils.stripColor($input), $input);
    });
});

describe('Utils.trimTimestamp()', function utilsTrimTimestampTests()
{
    it('should trim the timestamp', function()
    {
        var $input = 'test timestamp';

        Assert.strictEqual(Utils.trimTimestamp('[00:00:00] ' + $input), $input);
    });

    it('should return the exact same string [1]', function()
    {
        var $input = 'test';

        Assert.strictEqual(Utils.trimTimestamp($input), $input);
    });

    it('should return the exact same string [2]', function()
    {
        var $input = '[23:60:00] test';

        Assert.strictEqual(Utils.trimTimestamp($input), $input);
    });
});

describe('Utils.trimLinebreak()', function utilsTrimLinebreakTests()
{
    it('should trim the linebreak at the end [1]', function()
    {
        var $input = 'test tets';

        Assert.strictEqual(Utils.trimLinebreak($input + '\n'), $input);
    });

    it('should trim the linebreak at the end [2]', function()
    {
        var $input = 'test\ntets\n';

        Assert.strictEqual(Utils.trimLinebreak($input + '\n'), $input);
    });

    it('should return the exact same string [1]', function()
    {
        var $input = 'test tets';

        Assert.strictEqual(Utils.trimLinebreak($input), $input);
    });

    it('should return the exact same string [2]', function()
    {
        var $input = 'test\ntets';

        Assert.strictEqual(Utils.trimLinebreak($input), $input);
    });
});

describe('Utils.splitOnLinebreak()', function utilsSplitOnLinebreakTests()
{
    it('should split the string and return an array', function()
    {
        var $input = 'test1\ntest2\n';

        Assert.deepEqual(Utils.splitOnLinebreak($input), $input.split('\n'));
    });

    it('should return an array with one value', function()
    {
        var $input = 'test tets';

        Assert.deepEqual(Utils.splitOnLinebreak($input), [$input]);
    });
});

describe('readme examples', function readmeExamples()
{
    it('should succeed the `How to use` example', function()
    {
        LogInterceptor();

        console.log('log 1');
        console.log('log 2');

        Assert.deepEqual(LogInterceptor.end(), ['log 1\n', 'log 2\n']);
    });

    it('should succeed the `logInterceptor.endAll() API` example', function()
    {
        // level1
        LogInterceptor();

        console.log('log 1');

        // level2: pass output down to level1
        LogInterceptor(true);

        console.log('log 2');
        console.log('log 3');

        Assert.deepEqual(LogInterceptor.endAll(),
        [
            ['log 1\n', 'log 2\n', 'log 3\n'],
            ['log 2\n', 'log 3\n']
        ]);
    });
});
