/**
 * log-interceptor | lib/utils.js
 * file version: 0.00.001
 */
'use strict';

// var _     = require('underscore');
var Chalk = require('chalk');

////////////////////////////////////////////////////////////////////////////////

module.exports =
{
    /**
     * Take the stripColor function from Chalk.
     */
    'stripColor': Chalk.stripColor,

    /**
     * Trim a timestamp from the beginning of the string.
     *
     * @param {string} $str
     * @return {string}
     */
    'trimTimestamp': function($str)
    {
        if ($str.search(/^\[[0-2][0-3]:[0-5][0-9]:[0-5][0-9]\]/gm) !== -1)
        {
            $str = $str.substr(10);

            // trim extra seperator space when available
            if ($str.substr(0, 1) === ' ')
            {
                $str = $str.substr(1);
            }
        }

        return $str;
    },

    /**
     * Trim the last linebreak from the string.
     *
     * @param {string} $str
     * @return {string}
     */
    'trimLinebreak': function($str)
    {
        if ($str.substr(-1) === '\n')
        {
            $str = $str.substr(0, $str.length - 1);
        }

        return $str;
    },

    /**
     * Split a string with multiple linebreaks in seperate lines.
     *
     * @param {string} $str
     * @return {array}
     */
    'splitOnLinebreak': function($str)
    {
        return $str.split('\n');
    }
};
