'use strict';

describe('testability.js', function () {

  beforeEach(function () {
    testability.reset();
  });

	it('should load', function () {
		expect(testability).not.toBeUndefined();
	});

	it('should trigger the callback when nothing is pending', function () {
		var callback = jasmine.createSpy('callback');
		testability.when.ready(callback);
		expect(callback).toHaveBeenCalled();
	});

	it('should trigger the callback when oneLess has been called and oneMore has not', function () {
		var callback = jasmine.createSpy('callback');
		testability.wait.oneLess();
		testability.when.ready(callback);
		expect(callback).toHaveBeenCalled();
	});

	it('should trigger the callback when oneLess has been called before oneMore', function () {
		var callback = jasmine.createSpy('callback');
		testability.wait.oneLess();
		testability.wait.oneLess();
		testability.wait.oneLess();
		testability.wait.oneMore();
		testability.wait.oneLess();
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

	describe('counter handling', function () {
		genericSpecs(function asyncTask (callback) {
			testability.wait.oneMore();
			setTimeout(function () {
				callback();
				testability.wait.oneLess();
			});
		});
	});

	describe('promises handling', function () {
		genericSpecs(function asyncTask (callback) {
			var defer = Q.defer();
			setTimeout(function () {
				callback();
				defer.resolve();
			});
			testability.wait.for(defer.promise);
			return defer.promise;
		});
	});

  describe('task api handling', function () {
		genericSpecs(function asyncTask (callback) {
			var wait = testability.wait.start();
			setTimeout(function () {
				callback();
				wait.end();
				wait.end();
			});
		});
	});


	describe('counter handling with negative pending before adding to pending', function () {
    it('should trigger the callback when task ends correctly, but not before', function (done) {
      function asyncTask (callback) {
        testability.wait.oneLess();
        testability.wait.oneLess();
        testability.wait.oneLess();
        testability.wait.oneMore();
        setTimeout(function () {
          callback();
          testability.wait.oneLess();
        });
      }
			var jobDone = false;
			asyncTask(function () {
				jobDone = true;
			});
			testability.when.ready(function () {
				expect(jobDone).toBeTruthy();
				done();
			});
		});
	});
});
