'use strict';

describe('testability.js', function () {


	it('should load', function () {
		expect(testability).not.toBeUndefined();
	});

	it('should trigger the callback when nothing is pending', function () {
		var callback = jasmine.createSpy('callback');
		testability.when.ready(callback);
		expect(callback).toHaveBeenCalled();
	});

	function genericSpecs (asyncTask) {
        it('should trigger the callback when task ends correctly, but not before', function (done) {
            var jobDone = false;
            asyncTask(function () {
                jobDone = true;
            });
            testability.when.ready(function () {
                expect(jobDone).toBeTruthy();
                done();
            });
        });

        it('should not trigger the callback when tasks are chained', function (done) {
            var allDone = false;
            asyncTask(function () {
                asyncTask(function () {
                    allDone = true;
                });
            });
            testability.when.ready(function () {
                expect(allDone).toBeTruthy();
                done();
            });
        });
	}

    function readyForSpecs (asyncTask) {
        it('should trigger the callback when task ends correctly, but not before', function (done) {
            var jobDone = false;
            asyncTask(function () {
                jobDone = true;
            });
            testability.when.readyFor(1000, function () {
                expect(jobDone).toBeTruthy();
                done();
            });
        });

        it('should trigger the callback after specified delay', function (done) {
            var callbackCalled = false;

            testability.when.readyFor(1000, function () {
                callbackCalled = true;
            });

            setTimeout(function() {
                expect(callbackCalled).toBeTruthy();
                done();
            }, 1000);
        });

        it('should not trigger the callback before specified delay', function (done) {
            var callbackCalled = false;

            testability.when.readyFor(1000, function () {
                callbackCalled = true;
            });

            setTimeout(function() {
                expect(callbackCalled).toBeFalsy();
                done();
            }, 999);
        });

        it('should not trigger the callback when another task has been started', function(done) {
            var callbackCalled = false;

            testability.when.readyFor(1000, function () {
                callbackCalled = true;
            });

            asyncTask(function () {}, 2000);

            setTimeout(function() {
                expect(callbackCalled).toBeFalsy();
                done();
            }, 1500);
        });

        it('should restart waiting another task has been completed during waiting time');
    }

	describe('counter handling', function () {
        function asyncTask (callback, delay) {
            testability.wait.oneMore();
            setTimeout(function () {
                testability.wait.oneLess();
                callback();
            }, delay);
        }

		genericSpecs(asyncTask);

        readyForSpecs(asyncTask);
	});

	describe('promises handling', function () {
		genericSpecs(function asyncTask (callback) {
			var defer = Q.defer();
			setTimeout(function () {
				defer.resolve();
				callback();
			});
			testability.wait.for(defer.promise);
			return defer.promise;
		});
	});
});
