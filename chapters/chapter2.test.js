'use strict';

const assert = require('assert');
const co = require('co');
const superagent = require('superagent');
const thunkify = require('thunkify');

describe('Chapter 2: Asynchronous Coroutines', () => {
  /** @import:content/chapter-2-intro.md */
  it('', (done) => {
    const co = require('co');
    const superagent = require('superagent');

    co(function*() {
      const html = (yield superagent.get('http://www.google.com')).text;
      // HTML for Google's home page
      html;
      // acquit:ignore:start
      assert.ok(html);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-promises-thunks.md */
  it('Promises and Thunks', (done) => {
    const co = require('co');
    const superagent = require('superagent');
    const thunkify = require('thunkify');

    co(function*() {
      const thunk = thunkify(superagent.get)('http://www.google.com');
      // function
      typeof thunk;
      // A function's length property contains the number of parameters
      // In this case, 1
      thunk.length;
      // acquit:ignore:start
      assert.equal(typeof thunk, 'function');
      assert.equal(thunk.length, 1);
      // acquit:ignore:end
      const html = yield thunk;
      // HTML for Google's home page
      html;
      // acquit:ignore:start
      assert.ok(html);
      done();
      // acquit:ignore:end
    }).catch(error => done(error));
  });

  /** @import:content/chapter-2-thunkify.md */
  it('', (done) => {
    const co = require('co');
    const superagent = require('superagent');

    const thunkify = function(fn) {
      // Thunkify returns a function that takes some arguments
      return function() {
        // The function gathers the arguments
        const args = [];
        for (const arg of arguments) {
          args.push(arg);
        }
        // And returns a thunk
        return function(callback) {
          // The thunk calls the original function with your arguments
          // plus the callback
          return fn.apply(null, args.concat([callback]));
        };
      };
    };

    co(function*() {
      const thunk = thunkify(superagent.get)('http://www.google.com');
      // acquit:ignore:end
      const html = yield thunk;
      // HTML for Google's home page
      html;
      // acquit:ignore:start
      assert.ok(html);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-thunkify-context.md */
  it('', (done) => {
    class Test {
      async(callback) {
        return callback(null, this);
      }
    }

    co(function*() {
      const test = new Test();
      const res = yield thunkify(test.async)();
      // Woops, res refers to global object rather than the `test` variable
      assert.ok(res !== test);
      done();
    });
  });

  /** @import:content/chapter-2-promises.md */
  it('', (done) => {
    const promise = {
      then: function(onFulfilled, onRejected) {
        setTimeout(() => onFulfilled('Hello, World!'), 0);
      }
    };

    co(function*() {
      const str = yield promise;
      assert.equal(str, 'Hello, World!');
      // acquit:ignore:start
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-co.md */
  it('Write Your Own Co', (done) => {
    const fo = function(generatorFunction) {
      const generator = generatorFunction();
      next();

      function next(v) {
        const res = generator.next(v);
        if (res.done) {
          return;
        }
        handleAsync(res.value);
      }

      function handleAsync(async) {
        if (async && async.then) {
          handlePromise(async);
        } else if (typeof async === 'function') {
          handleThunk(async);
        } else {
          generator.throw(new Error(`Invalid yield ${async}`))
        }
      }

      function handlePromise(async) {
        const onRejected = function(error) {
          generator.throw(error);
        }
        async.then(next, onRejected);
      }

      function handleThunk(async) {
        async((error, v) => {
          if (error) {
            generator.throw(error);
            return;
          }
          next(v);
        });
      }
    };

    // fo in action
    fo(function*() {
      const html = (yield superagent.get('http://www.google.com')).text;
      // acquit:ignore:start
      assert.ok(html);
      done();
      // acquit:ignore:end
    });
  });
});
