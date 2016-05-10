'use strict';

/*exported testability*/
var testability = (function Testability () {

    if (!this || this.constructor !==  Testability) {
        return new Testability();
    }

    var pendingCount = 0;
    var pendingCallbacks = [];

    this.when = {
        ready: function (callback) {
            if (pendingCount === 0) {
                callback();
            }
            else {
                pendingCallbacks.push(callback);
            }
        },

        readyFor: function (time, callback) {
            var _this = this;
            _this.ready(function () {
                setTimeout(function () {
                    var stillDone = (pendingCount === 0);
                    if (stillDone) {
                        callback();
                    }
                    else {
                        _this.readyFor(time, callback);
                    }
                }, time);
            });
        }
    };

    this.wait = {
        oneMore: function () {
            pendingCount += 1;
        },
        oneLess: function () {
            pendingCount -= 1;
            if (pendingCount === 0) {
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
