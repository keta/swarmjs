var Swarm = (function () {

/**
 * @param {Object} obj1
 * @param {Object} [obj2]
 * @returns {Object}
 */
var extend = function (obj1, obj2) {
    var result = {};
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0, l = args.length; i < l; i++) {
        if (args[i]) {
            for (var o in args[i]) {
                if (args[i].hasOwnProperty(o)) {
                    result[o] = args[i][o];
                }
            }
        }
    }
    return result;
};

/**
 * Swarm class
 * @param {Object} [opts] Options that will override defaults
 * @constructor
 */
var Swarm = function (opts) {
    this.options = extend(this.defaults, opts);
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
 * @returns {Number}
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
 * @param {Object} [scope] Scope to pass for callback, window by default
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

return Swarm;

})();
