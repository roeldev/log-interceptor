/**
 * log-interceptor | test/util_tests.js
 * file version: 0.00.002
 */
'use strict';

var Assert         = require('assert');
var GulpUtil       = require('gulp-util');
var Chalk          = GulpUtil.colors;
var LogInterceptor = require('../lib/index.js');
var Utils          = LogInterceptor.utils;

////////////////////////////////////////////////////////////////////////////////

LogInterceptor._config =
{
    'passDown':         false,
    'stripColor':       false,
    'trimTimestamp':    false,
    'trimLinebreak':    false,
    'splitOnLinebreak': false
};

//------------------------------------------------------------------------------

describe('Utils.stripColor()', function stripColorTests()
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

describe('Utils.trimTimestamp()', function trimTimestampTests()
{
    it('should trim the timestamp', function()
    {
        var $input = 'test timestamp';

        Assert.strictEqual(Utils.trimTimestamp('[00:00:00] ' + $input), $input);
    });

    it('should trim the colored timestamp', function()
    {
        LogInterceptor();
        GulpUtil.log('test');

        var $input = LogInterceptor.end();

        Assert.strictEqual(Utils.trimTimestamp($input[0], true), 'test\n');
    });

    it('should return the exact same string', function()
    {
        var $input = 'test';

        Assert.strictEqual(Utils.trimTimestamp($input), $input);
    });
});

describe('Utils.trimLinebreak()', function trimLinebreakTests()
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

describe('Utils.splitOnLinebreak()', function splitOnLinebreakTests()
{
    it('should split the string and return an array', function()
    {
        var $input = ['test1\n', 'test2\n'];

        Assert.deepEqual(Utils.splitOnLinebreak($input.join('')), $input);
    });

    it('should return an array with one value', function()
    {
        var $input = 'test tets';

        Assert.deepEqual(Utils.splitOnLinebreak($input), [$input + '\n']);
    });
});
