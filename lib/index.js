/**
 * log-interceptor | lib/index.js
 * file version: 0.00.002
 */
'use strict';

var _           = require('underscore');
var Chalk       = require('chalk');
var StdoutWrite = process.stdout.write.bind(process.stdout);

////////////////////////////////////////////////////////////////////////////////

var LogInterceptor;
var Scope =
{
    'stripColor': Chalk.stripColor
};

/**
 * Creates a handler function.
 *
 * @param {function} $callback
 * @return {function}
 */
function createHandler($callback)
{
    var $i = (LogInterceptor._logs.length - 1);

    return function($str)
    {
        LogInterceptor._logs[$i].push($str);

        if (_.isFunction($callback))
        {
            // when the callback function returns `true`, pass the
            // arguments down to the below log-interceptor, or the default
            // `stdout.write` function
            var $passdown = $callback.apply(Scope, arguments);
            if ($passdown === true)
            {
                if ($i >= 1)
                {
                    LogInterceptor._handlers[$i].apply(Scope, arguments);
                }
                else
                {
                    StdoutWrite.apply(process.stdout, arguments);
                }
            }
        }
    };
}

//------------------------------------------------------------------------------

/**
 * Starts the log interceptor.
 *
 * @param {function|boolean} $callback - Callback interception function
 */
LogInterceptor = function($callback)
{
    LogInterceptor._logs.push([]);
    LogInterceptor._handlers.push(process.stdout.write);

    // create pass down callback function
    if ($callback === true)
    {
        $callback = function()
        {
            return true;
        };
    }

    // put in own container so the current level ($i) is remembered
    process.stdout.write = createHandler($callback);
};

/**
 * End current intercept session and restore previous `LogIntercepter` or the
 * original `process.stdout.write` function.
 * Returns an array with intercepted output from `console.log`.
 *
 * @return {array|boolean}
 */
LogInterceptor.end = function()
{
    if (!LogInterceptor._logs.length || !LogInterceptor._handlers.length)
    {
        return false;
    }

    // restore previous handler
    process.stdout.write = LogInterceptor._handlers.pop();

    // return intercepted logs
    return LogInterceptor._logs.pop();
};

/**
 * Ends all intercept sessions and restores the original `process.stdout.write`
 * function.
 *
 * @return {array|boolean}
 */
LogInterceptor.endAll = function()
{
    if (!LogInterceptor._logs.length || !LogInterceptor._handlers.length)
    {
        return false;
    }

    var $result = false;
    if (LogInterceptor._logs.length === 1)
    {
        $result = LogInterceptor.end();
    }
    else
    {
        process.stdout.write = StdoutWrite;
        $result = LogInterceptor._logs;
    }

    LogInterceptor._logs     = [];
    LogInterceptor._handlers = [];

    return $result;
};

/**
 * Array with intercepted output.
 * @type {array}
 */
LogInterceptor._logs = [];

/**
 * Array with registered interception handlers.
 * @type {array}
 */
LogInterceptor._handlers = [];

/*
    log-interceptor
    Copyright (c) 2015 Roel Schut (roelschut.nl)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
module.exports = LogInterceptor;
