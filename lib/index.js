/**
 * log-interceptor | lib/index.js
 * file version: 0.00.001
 */
'use strict';

var _           = require('underscore');
var Chalk       = require('chalk');
var StdoutWrite = process.stdout.write.bind(process.stdout);

////////////////////////////////////////////////////////////////////////////////

var Utils =
{
    'stripColor': Chalk.stripColor
};

//------------------------------------------------------------------------------

/**
 * Starts the log interceptor.
 *
 * @param {[type]} $callback [description]
 */
var LogInterceptor = function($callback)
{
    LogInterceptor._logs.push([]);
    LogInterceptor._handlers.push(process.stdout.write);

    if ($callback === true)
    {
        $callback = function()
        {
            return true;
        };
    }

    // put in own container so the current level ($i) is remembered
    process.stdout.write = (function()
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
                var $passdown = $callback.apply(Utils, arguments);
                if ($passdown === true)
                {
                    if ($i >= 1)
                    {
                        LogInterceptor._handlers[$i]($str);
                    }
                    else
                    {
                        StdoutWrite($str);
                    }
                }
            }
        };
    })();
};

/**
 * End current intercept session and restore previous `LogIntercepter` or the
 * original `process.stdout.write` function.
 * Returns an array with intercepted output from `console.log`.
 *
 * @return {array}
 */
LogInterceptor.end = function()
{
    // restore previous handler
    process.stdout.write = LogInterceptor._handlers.pop();

    // return intercepted logs
    return LogInterceptor._logs.pop();
};

/**
 * Ends all intercept sessions and restores the original `process.stdout.write`
 * function.
 *
 * @return {array}
 */
LogInterceptor.endAll = function()
{
    if (LogInterceptor._logs.length === 1)
    {
        return LogInterceptor.end();
    }
    else
    {
        process.stdout.write = StdoutWrite;
        return LogInterceptor._logs;
    }
};

LogInterceptor._handlers = [];
LogInterceptor._logs     = [];

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
