# testability.js

[![Build Status](https://secure.travis-ci.org/alfonso-presa/testability.js.png?branch=master)](http://travis-ci.org/alfonso-presa/testability.js)

Independent browser testability state provider

## Installation

Using bower:

```
$ bower install --save-dev testability.js
```

Using npm:

```
$ npm install --save-dev testability.js
```

## Usage

The purpose of this library is to enable an independent way for frameworks to notify that the current context state is not completed and as such testing frameworks should wait before continuing their testing flow. It is currently meant for the front end

Currently only an implementation is provided but in the future this should be an spec an a reference implementation so that frameworks could provide their own implementation and not depend on this one.

## Documentation

A global object called testability is provided. This object provides a way for runtime frameworks to keep track of their work in progress tasks, and for testing frameworks to be notified when all of this tasks end.

## API

Before continuing after triggering an action that could affect the state of the application being tested, a testing framework should:

```js
testability.when.ready(function () {
	//keep on
});
```

When starting an asynchronous tasks the runtime framework, library or application should:

```js
testability.wait.for(myPromise);
```

Or it can also do this:

```js
var task = testability.wait.start();
//....
//Do some async stuff here
//....
task.end();
```

## WIP

Theres two projects in progress:
- [protractor-testability-plugin](https://github.com/alfonso-presa/protractor-testability-plugin): provides an "protractor adapter" so that frameworks diferent from angular could use testability.js spec to be tested with protractor.
- Another (not yet public) to provide an "angular adapter" to enable angular testing with testing frameworks following testability.js spec.

## License

MIT
