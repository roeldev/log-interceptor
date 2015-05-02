/**
 * log-interceptor | test/main.js
 * file version: 0.00.001
 */
'use strict';

var Assert         = require('assert');
var LogInterceptor = require('../lib/index.js');

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
