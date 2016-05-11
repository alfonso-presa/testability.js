/*! testability.js - v0.2.0
 *  Release on: 2016-05-11
 *  Copyright (c) 2016 Alfonso Presa
 *  Licensed MIT */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['testability'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['testability'] = factory();
  }
}(this, function () {

'use strict';

/*exported testability*/
var testability = (function Testability () {

    if (!this || this.constructor !==  Testability) {
        return new Testability();
    }

    var pendingCount = 0;
    var pendingCallbacks = [];

    var lastTaskCompleted;
    var currentTime = function () { return new Date().getTime(); };

    this.when = {
        ready: function (callback) {
            if (pendingCount === 0) {
                callback();
            }
            else {
                pendingCallbacks.push(callback);
            }
        },

        readyFor: function (delay, callback) {
            var self = this;
            self.ready(function () {
                setTimeout(function () {
                    var stillDone = false;

                    if (lastTaskCompleted) {
                        var time = currentTime();
                        var timeSinceLastTask = time - lastTaskCompleted;
                        if (timeSinceLastTask >= delay) {
                            stillDone = true;
                        }
                    }

                    if (stillDone) {
                        callback();
                    }
                    else {
                        self.readyFor(delay, callback);
                    }
                }, delay);
            });
        }
    };

    this.wait = {
        oneMore: function () {
            pendingCount += 1;
            lastTaskCompleted = null;
        },
        oneLess: function () {
            pendingCount -= 1;
            if (pendingCount === 0) {
                lastTaskCompleted = currentTime();
                setTimeout(function () {
                    while (pendingCount === 0 && pendingCallbacks.length !== 0) {
                        pendingCallbacks.pop()();
                    }
                });
            }
        },
        for: function (promise) {
            this.oneMore();
            promise.then(this.oneLess).catch(this.oneLess);
        }
    };
})();

return testability;

}));
