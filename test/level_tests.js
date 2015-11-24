/**
 * log-interceptor | test/level_tests.js
 */
'use strict';

var Assert         = require('assert');
var Level          = require('../lib/level.js');
var LogInterceptor = require('../lib/index.js');
var GulpUtil       = require('gulp-util');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

describe('new Level()', function newLevelTests()
{
    it('should create a new Level object and assign a depth', function()
    {
        var $level = new Level({});

        Assert.strictEqual($level.depth, LogInterceptor._levels.length);
    });

    it('should create a new Level object and assign options', function()
    {
        var $input = { 'options': 'test' };

        Assert.strictEqual(new Level($input).options, $input);
    });

    it('should create a new Level object and assign callbackFn', function()
    {
        var $input = function()
        {
            return false;
        };

        Assert.strictEqual(new Level({}, $input).callbackFn, $input);
    });

    it('should create a new Level obj and set hasFormatOptions [1]', function()
    {
        var $level = new Level({});

        Assert.strictEqual($level.hasFormatOptions, false);
    });

    it('should create a new Level obj and set hasFormatOptions [2]', function()
    {
        var $level = new Level({ 'stripColor': true });

        Assert.strictEqual($level.hasFormatOptions, true);
    });
});

describe('Level.addToLog()', function addToLogTests()
{
    it('should add the value to the log array', function()
    {
        var $level = new Level({});
        $level.addToLog('test');
        $level.addToLog('test2');

        Assert.deepEqual($level.log, ['test', 'test2']);
    });
});

describe('Level.formatAndLog()', function formatAndLogTests()
{
    it('should add the value and not format it [1]', function()
    {
        var $level = new Level({});
        $level.formatAndLog('test');

        Assert.deepEqual($level.log, ['test']);
    });

    it('should add the value and not format it [2]', function()
    {
        var $level = new Level({});

        Assert.strictEqual($level.formatAndLog('test'), false);
    });

    it('should strip the ansi color', function()
    {
        var $level = new Level({ 'stripColor': true });
        $level.formatAndLog('\u001b[90mtest\u001b[39m');

        Assert.deepEqual($level.log, ['test']);
    });

    it('should trim the timestamp', function()
    {
        LogInterceptor();
        GulpUtil.log('test');

        var $level = new Level({ 'trimTimestamp': true });
        $level.formatAndLog(LogInterceptor.end().join(''));

        Assert.deepEqual($level.log, ['test\n']);
    });

    it('should trim the last linebreak', function()
    {
        var $level = new Level({ 'trimLinebreak': true });
        $level.formatAndLog('test\ntest2\n');

        Assert.deepEqual($level.log, ['test\ntest2']);
    });

    it('should split on linebreak', function()
    {
        var $level = new Level({ 'splitOnLinebreak': true });
        $level.formatAndLog('test\ntest2\n');

        Assert.deepEqual($level.log, ['test\n', 'test2\n']);
    });

    it('should split on linebreak and strip/trim everything else', function()
    {
        var $level = new Level(
        {
            'stripColor':       true,
            'trimTimestamp':    true,
            'trimLinebreak':    true,
            'splitOnLinebreak': true
        });

        LogInterceptor();

        GulpUtil.log('test');
        console.log('test2');

        $level.formatAndLog(LogInterceptor.end().join(''));

        Assert.deepEqual($level.log, ['test', 'test2']);
    });
});

describe('Level.callback()', function callbackTests()
{
    it('should call the callback function', function()
    {
        var $actual = [];
        var $level = new Level({}, function($str1, $str2)
        {
            $actual.push($str1);
            $actual.push($str2);
        });

        $level.callback('test1', ['test2']);

        Assert.deepEqual($actual, ['test1', ['test2']]);
    });

    it('should have the utilities object as scope', function()
    {
        var $actual;
        var $level = new Level({}, function()
        {
            $actual = this;
        });

        $level.callback('test1', ['test2']);

        Assert.strictEqual($actual, LogInterceptor.utils);
    });
});

describe('Level.handle()', function handleTests()
{
    it('should return true to pass down the output [1]', function()
    {
        var $level = new Level({ 'passDown': true });

        Assert.strictEqual($level.handle(''), true);
    });

    it('should return true to pass down the output [2]', function()
    {
        var $level = new Level({ 'passDown': false }, function()
        {
            return true;
        });

        Assert.strictEqual($level.handle(''), true);
    });

    it('should return false to pass down the output [1]', function()
    {
        var $level = new Level({ 'passDown': false });

        Assert.strictEqual($level.handle(''), false);
    });

    it('should return false to pass down the output [2]', function()
    {
        var $level = new Level({ 'passDown': true }, function()
        {
            return false;
        });

        Assert.strictEqual($level.handle(''), false);
    });
});
