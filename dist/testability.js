/*! testability.js - v0.0.0
 *  Release on: 2015-06-13
 *  Copyright (c) 2015 Alfonso Presa
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

    this.when = {
        ready: function (callback) {
            if (pendingCount === 0) {
                callback();
            }
            else {
                pendingCallbacks.push(callback);
            }
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

return testability;

}));
