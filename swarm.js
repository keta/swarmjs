(function () {

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
 * @param {Object} [opts]
 * @constructor
 */
var Swarm = function (opts) {
    var options = extend(this.defaults, opts);

    this.currentTick = 0;
    this.callsCount = 0;

    if (options.countTotal) {
        this.totalCalls = 0;
    }
};

Swarm.prototype.defaults = {
    limit: 0,
    interval: 0,
    countTotal: false,
    scope: null
};

/**
 * @returns {Number}
 */
Swarm.prototype.getTick = function () {
    return Math.floor((new Date()) / (this.options.interval || 1));
};

/**
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
 * @param {Function} func
 * @param {Array} [args]
 * @param {Object} [scope]
 * @returns {boolean} True if function was called immediately, False if added to swarm
 */
Swarm.prototype.add = function (func, args, scope) {
    var currentTick = this.currentTick;
    if (!this.options.limit || !this.options.interval) {
        this._apply(func, args, scope);
    } else if (this.getTick() != currentTick) {
        if (this.callsCount < this.options.limit) {
            this._apply(func, args, scope);
        } else {
            var checkInterval = setInterval(function () {
                if (self.getTick() != currentTick) {
                    clearInterval(checkInterval);
                    self.add(func, args, scope);
                }
            }, 100);
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
