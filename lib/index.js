/**
 * log-interceptor | lib/index.js
 * file version: 0.00.006
 */
'use strict';

var _     = require('underscore');
var Utils = require('./utils.js');
var Level;
var LogInterceptor;

// create reference to original `process.stdout.write`. we'll do this to still
// be able to write stuff to the `process.stdout` stream.
var StdoutWrite = process.stdout.write.bind(process.stdout);

////////////////////////////////////////////////////////////////////////////////

/**
 * Starts the log interceptor.
 *
 * @param {object} $options - Optional transform options
 * @param {function} $callbackFn - Callback interception function
 */
LogInterceptor = function($options, $callbackFn)
{
    if (arguments.length === 1)
    {
        if (_.isFunction(arguments[0]))
        {
            $options    = false;
            $callbackFn = arguments[0];
        }
        else if ($options === true)
        {
            $options = { 'passDown': true };
        }
        else if ($options === false)
        {
            $options = { 'passDown': false };
        }
    }
    else if (arguments.length >= 2 && !_.isFunction($callbackFn))
    {
        // when the 2nd arg is set but not a function, unset it
        $callbackFn = null;
    }

    // when options is not a valid object, use the default options
    $options = (!$options || !_.isObject($options) || _.isArray($options) ?
        LogInterceptor.defaultOptions :
        _.extend({}, LogInterceptor.defaultOptions, $options));


    // load Level class when not already loaded. don't load at the top of this
    // file, otherwise the LogInterceptor referenced in level.js is empty
    if (!Level)
    {
        Level = require('./level.js');
    }

    // create new interceptor level
    var $level = new Level($options, $callbackFn);
    LogInterceptor._levels.push($level);

    // this is where the magic starts. replace the stdout write function with
    // an interceptor function wich allows us to capture the output from
    // `console.log` and process it anyway we like
    if (process.stdout.write !== LogInterceptor._interceptor)
    {
        process.stdout.write = LogInterceptor._interceptor;
    }
};

//------------------------------------------------------------------------------

/**
 * Array with the active levels. Each level contains an object with a log
 * array, handler function and options object.
 *
 * @access private
 * @type {array}
 */
LogInterceptor._levels = [];

/**
 * The current default options.
 *
 * @type {object}
 */
LogInterceptor.defaultOptions =
{
    'passDown':         false,
    'stripColor':       false,
    'trimTimestamp':    false,
    'trimLinebreak':    false,
    'splitOnLinebreak': false
};

/**
 * Object with several useful util functions.
 *
 * @type {object}
 */
LogInterceptor.utils = Utils;

/**
 * Main interceptor function wich passes the intercepted output from the highest
 * level to the lowest, as long as the level suggest to do so.
 *
 * @access private
 * @param {string} $str - The intercepted output
 */
LogInterceptor._interceptor = function($str)
{
    var $depth    = (LogInterceptor._levels.length - 1);
    var $passDown = true;

    if ($depth >= 0)
    {
        var $level;

        // loop from high to low
        for (; $depth >= 0; $depth--)
        {
            $level    = LogInterceptor._levels[$depth];
            $passDown = $level.handle($str);

            // LogInterceptor._debug('passdown?', $level.depth, $passDown);
            // LogInterceptor._debug('');

            if (!$passDown)
            {
                // LogInterceptor._debug('break');
                break;
            }
        }
    }

    // pass down to original `process.stdout.write`
    if ($passDown)
    {
        StdoutWrite($str);
    }
};

/**
 * Internal debug function. Will write all arguments using
 * `LogInterceptor.write`.
 *
 * @access private
 * @param {string} $str...
 */
LogInterceptor._debug = function()
{
    LogInterceptor.write(_.toArray(arguments).join(', ') + '\n');
};

//------------------------------------------------------------------------------

/**
 * Use the original `process.stdout.write` function to display the given string.
 */
LogInterceptor.write = StdoutWrite;

/**
 * End current intercept session and restore previous `LogIntercepter` or the
 * original `process.stdout.write` function.
 * Returns an array with intercepted output from `console.log`.
 *
 * @return {array|boolean}
 */
LogInterceptor.end = function()
{
    if (!LogInterceptor._levels.length)
    {
        return false;
    }

    // remove current interceptor level
    var $level = LogInterceptor._levels.pop();

    // restore original `process.stdout.write` when no more levels are present
    if (!LogInterceptor._levels.length)
    {
        process.stdout.write = StdoutWrite;
    }

    // return intercepted logs
    return $level.log;
};

/**
 * Ends all intercept sessions and restores the original `process.stdout.write`
 * function.
 *
 * @return {array|boolean}
 */
LogInterceptor.endAll = function()
{
    var $result   = false;
    var $maxDepth = LogInterceptor._levels.length;

    if ($maxDepth >= 1)
    {
        $result = [];
        for (var $i = 0; $i < $maxDepth; $i++)
        {
            $result.push(LogInterceptor._levels[$i].log);
        }
    }

    process.stdout.write   = StdoutWrite;
    LogInterceptor._levels = [];

    return $result;
};

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
