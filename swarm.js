/**
 * SwarmJS 1.0.1
 *
 * Javascript callback manager
 * http://github.com/keta/swarmjs
 *
 * Copyright 2013-2014, Aleksandr "keta" Kavun
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
(function () {

    /**
     * Swarm class
     * @param {Object} [opts] Options that will override defaults
     * @constructor
     */
    var Swarm = function (opts) {
        this.options = opts || {};
        for (var o in this.defaults) {
            if (!(o in this.options)) {
                this.options[o] = this.defaults[o];
            }
        }

        this.currentTick = 0;
        this.callsCount = 0;
        if (this.options.countTotal) {
            this.totalCalls = 0;
        }
    };

    /**
     * @type {{limit: number, interval: number, frequency: number, countTotal: boolean, scope: Object}}
     */
    Swarm.prototype.defaults = {
        /**
         * @var {number} Limit for calls per interval
         */
        limit: 0,
        /**
         * @var {number} Interval for limited calls in milliseconds
         */
        interval: 0,
        /**
         * @var {number} Interval change checks frequency in milliseconds
         */
        frequency: 100,
        /**
         * @var {boolean} Should total calls be counted or not
         */
        countTotal: false,
        /**
         * @var {Object} Scope to pass to the callbacks
         */
        scope: null
    };

    /**
     * Gets tick id for the interval
     * @returns {number}
     */
    Swarm.prototype.getTick = function () {
        return Math.floor((new Date()) / (this.options.interval || 1));
    };

    /**
     * Calls function with supplied arguments and scope
     * @param {Function} func
     * @param {Array} [args]
     * @param {Object} [scope]
     */
    Swarm.prototype._apply = function (func, args, scope) {
        func.apply(scope || this.options.scope, args || []);
        this.callsCount++;
        if (this.options.countTotal) {
            this.totalCalls++;
        }
    };

    /**
     * Adds callback to the swarm
     * @param {Function} func Callback function
     * @param {Array} [args] Arguments list
     * @param {Object} [scope] Scope to pass for callback, global (window) by default
     * @returns {boolean} True if function was called immediately, False if added to swarm
     */
    Swarm.prototype.add = function (func, args, scope) {
        var currentTick = this.currentTick;
        if (!this.options.limit || !this.options.interval) {
            this._apply(func, args, scope);
        } else if (this.getTick() == currentTick) {
            if (this.callsCount < this.options.limit) {
                this._apply(func, args, scope);
            } else {
                var self = this;
                var checkInterval = setInterval(function () {
                    if (self.getTick() != currentTick) {
                        clearInterval(checkInterval);
                        self.add(func, args, scope);
                    }
                }, this.options.frequency);
                return false;
            }
        } else {
            this.currentTick = this.getTick();
            this.callsCount = 0;
            this._apply(func, args, scope);
        }
        return true;
    };

    if ((typeof define == 'function') && define.amd) {
        // define Swarm as an AMD module
        define(Swarm);
    } else {
        // define Swarm as a global variable, saving original variable inside it
        Swarm.original = window.Swarm;
        window.Swarm = Swarm;
    }

}());
