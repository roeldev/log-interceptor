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

describe('readme examples', function readmeExamples()
{
    it('succeed the `How to use` example', function()
    {
        LogInterceptor();

        console.log('log 1');
        console.log('log 2');

        Assert.deepEqual(LogInterceptor.end(), ['log 1\n', 'log 2\n']);
    });

    it('succeed the `logInterceptor.endAll() API` example', function()
    {
        // level1
        LogInterceptor();

        console.log('log 1');

        // level2: pass output down to level1
        LogInterceptor(true);

        console.log('log 2');
        console.log('log 3');

        Assert.deepEqual(LogInterceptor.endAll(), [
            ['log 1\n', 'log 2\n', 'log 3\n'],
            ['log 2\n', 'log 3\n']
        ]);
    });
});
