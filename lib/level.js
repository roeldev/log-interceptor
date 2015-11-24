/**
 * log-interceptor | lib/level.js
 */
'use strict';

var LogInterceptor = require('./index.js');
var Utils          = require('./utils.js');

// -----------------------------------------------------------------------------

function Level($options, $callbackFn)
{
    this.depth      = LogInterceptor._levels.length;
    this.options    = $options;
    this.callbackFn = $callbackFn;
    this.log        = [];

    this.hasFormatOptions = ($options.stripColor === true ||
                             $options.trimTimestamp === true ||
                             $options.trimLinebreak === true ||
                             $options.splitOnLinebreak === true);
}

Level.prototype =
{
    /**
     * The current depth of the level.
     *
     * @type {number}
     */
    'depth': null,

    /**
     * The config options for this level.
     *
     * @type {object}
     */
    'options': null,

    /**
     * Indicates whether the options object has one of the format options
     * enabled.
     *
     * @type {boolean}
     */
    'hasFormatOptions': false,

    /**
     * Array with all intercepted log output.
     *
     * @type {array}
     */
    'log': null,

    /**
     * A custom specified callback function wich can further process the
     * intercepted output.
     */
    'callbackFn': null,

    /**
     * Adds the string to the log array.
     *
     * @param {string} $str
     */
    addToLog: function($str)
    {
        this.log.push($str);
    },

    /**
     * Will format and log the intercepted string and return an array with the
     * formatted result, or `false` when no format options are enabled.
     *
     * @param {string} $str
     * @return {boolean|array}
     */
    formatAndLog: function($str)
    {
        if (!this.hasFormatOptions)
        {
            this.addToLog($str);
            return false;
        }

        // strip colors from the string. this is ok with multilines
        if (this.options.stripColor)
        {
            $str = Utils.stripColor($str);
        }

        var $result = [];
        if (this.options.splitOnLinebreak)
        {
            var $split = Utils.splitOnLinebreak($str,
                                                this.options.trimLinebreak);

            for (var $i = 0, $iL = $split.length; $i < $iL; $i++)
            {
                $str = $split[$i];
                if (this.options.trimTimestamp)
                {
                    $str = Utils.trimTimestamp($str, !this.options.stripColor);
                }

                this.addToLog($str);
                $result.push($str);
            }
        }
        else
        {
            if (this.options.trimTimestamp)
            {
                $str = Utils.trimTimestamp($str, !this.options.stripColor);
            }

            if (this.options.trimLinebreak)
            {
                $str = Utils.trimLinebreak($str);
            }

            this.addToLog($str);
            $result.push($str);
        }

        return $result;
    },

    /**
     * Execute the callback function when set to the Level object.
     *
     * @param {string} $str - The original intercepted output string.
     * @param {boolean|array} $formattedStr
     * @return {boolean}
     */
    callback: function($str, $formattedStr)
    {
        return !!this.callbackFn.call(Utils, $str, $formattedStr);
    },

    /**
     * The intercept handler function wich processes the intercepted output.
     * The return values determines whether the intercepted output should be
     * passed down to the level below.
     *
     * @param {string} $str - The intercepted output.
     * @return {boolean}
     */
    handle: function($str)
    {
        var $passDown     = (this.options.passDown === true);
        var $formattedStr = this.formatAndLog($str);

        if (this.callbackFn)
        {
            // execute callback function, send the original intercepted str and
            // the formatted string.
            $passDown = this.callback($str, $formattedStr);
        }

        // pass down to below level?
        return $passDown;
    }
};

module.exports = Level;
