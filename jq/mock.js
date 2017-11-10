(function() {
    var root = (typeof self === 'object' && self.self == self && self) ||
        (typeof glabal == 'object' && global.glabal == global && global) ||
        this || {};

    function isValidListener(fn) {
        if (typeof fn === 'function') {
            return true;
        } else if (fn && typeof fn === 'object') {
            return isValidListener(fn.fn)
        } else {
            return false;
        }
    }

    function indexof(array, item) {
        if (array.indexOf) {
            return array.indexOf(item);
        } else {
            var result = -1;
            for (var i = 0; i < array.length; i++) {
                if (array[i] === item) {
                    result = i;
                    break;
                }
            }
            return result;
        }
    }

    function EventEmitter() {
        this._events = {};
    }

    var proto = EventEmitter.prototype;

    //添加事件
    proto.on = function(eventName, fn) {
        if (!eventName || !fn) return;
        if (!isValidListener(fn)) {
            throw new TypeError('not fn');
        }
        if (!this._events[eventName]) this._events[eventName] = [];
        var fnIsExit = typeof fn === 'object';
        //不重复添加
        if (indexof(this._events[eventName], fn) === -1) {
            this._events[eventName].push(fnIsExit ? fn : {
                fn: fn,
                once: false
            })
        }
        return this;
    };
    //添加一次
    proto.once = function(eventName, fn) {
        return this.on(eventName, {
            fn: fn,
            once: true
        })
    };
    //删除
    proto.off = function(eventName, fn) {
        var fns = this._events[eventName];
        if (!fn) return;
        var index;
        for (var i = 0; i < fns.length; i++) {
            if (fn === fns[i]) {
                index = i;
                break;
            }
        }
        if (typeof index !== 'undefined') {
            fns.splice(i, 1);
        }
        return this;
    }

    //删除全部
    proto.offall = function(eventName) {
        if (eventName && this._events[eventName]) {
            this._events[eventName] = [];
        } else {
            this._events = {};
        }
    }

    //触发
    proto.emit = function(eventName, args) {
        var listeners = this._events[eventName];
        if (!listeners) return;

        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            if (listener) {
                listener.fn.apply(this, args || []);
                if (listener.once) {
                    this.off(eventName, listener.fn)
                }
            }

        }

        return this;
    }

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = EventEmitter;
        }
        exports.EventEmitter = EventEmitter
    } else {
        root.EventEmitter = EventEmitter;
    }
})()