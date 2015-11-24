/**
 * log-interceptor | lib/utils.js
 */
'use strict';

var REGEXP_PART_TIME   = '(([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9])';
var REGEXP_PART_COLORS = '(\\u001b\\[[0-9]{2}m)';

var REGEXP_PLAIN = '^\\[' + REGEXP_PART_TIME + '\\]';
var REGEXP_ANSI  = '^\\[' + REGEXP_PART_COLORS +
                            REGEXP_PART_TIME +
                            REGEXP_PART_COLORS + '\\]';

// -----------------------------------------------------------------------------

module.exports =
{
    /**
     * Use _strip-ansi_ to strip colors from a string.
     *
     * @param {string} $str
     * @return {string}
     */
    'stripColor': require('strip-ansi'),

    /**
     * Trim a timestamp from the beginning of the string. First checks for the
     * timestamp without color coding. When none found and the `checkColors`
     * arg equals `true`, the function searches for color coded timestamps.
     *
     * @param {string} $str
     * @param {boolean} $checkColors [true]
     * @return {string}
     */
    trimTimestamp: function($str, $checkColors)
    {
        var $regex = new RegExp(REGEXP_PLAIN, 'gm');
        var $match = $str.match($regex);

        if (!!$match)
        {
            $str   = $str.substr($match[0].length);
            $match = true;
        }
        else if ($checkColors !== false)
        {
            $regex = new RegExp(REGEXP_ANSI, 'gm');
            $match = $str.match($regex);

            if (!!$match)
            {
                $str   = $str.substr($match[0].length);
                $match = true;
            }
        }

        // trim extra seperator space when available
        if ($match && $str.substr(0, 1) === ' ')
        {
            $str = $str.substr(1);
        }

        return $str;
    },

    /**
     * Trim the last linebreak from the string.
     *
     * @param {string} $str
     * @return {string}
     */
    trimLinebreak: function($str)
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
     * @param {boolean} $trimLineBreaks [false]
     * @return {array}
     */
    splitOnLinebreak: function($str, $trimLineBreaks)
    {
        var $split = $str.split('\n');

        // remove last entry when it's an empty string. this happens when
        // splitting a str like 'test\n' => ['test', ''] and is not what
        // we want :)
        if ($split[$split.length - 1] === '')
        {
            $split.pop();
        }

        // when linebreaks should not be trimmed, put \n back on every line
        if ($trimLineBreaks !== true)
        {
            for (var $i = 0, $iL = $split.length; $i < $iL; $i++)
            {
                $split[$i] += '\n';
            }
        }
        return $split;
    }
};
