'use strict';

const assert = require('assert');
const co = require('co');
const superagent = require('superagent');
const thunkify = require('thunkify');

const fo = function(generatorFunction) {
  const generator = generatorFunction();
  next();

  // Call next() or throw() on the generator as necessary
  function next(v, isError) {
    const res = isError ? generator.throw(v) : generator.next(v);
    if (res.done) {
      return;
    }
    handleAsync(res.value);
  }

  // Handle the result the generator yielded
  function handleAsync(async) {
    if (async && async.then) {
      handlePromise(async);
    } else if (typeof async === 'function') {
      handleThunk(async);
    } else {
      next(new Error(`Invalid yield ${async}`), true);
    }
  }

  // If the generator yielded a promise, call `.then()`
  function handlePromise(async) {
    async.then(next, (error) => next(error, true));
  }

  // If the generator yielded a thunk, call it
  function handleThunk(async) {
    async((error, v) => {
      error ? next(error, true) : next(v);
    });
  }
};

const fo2 = function() {
  const fo = function(input) {
    const isGenerator = (v) => typeof v.next === 'function';
    const isGeneratorFunction =
      (v) => v.constructor && v.constructor.name === 'GeneratorFunction';

    let generator;
    if (isGenerator(input)) generator = input;
    if (isGeneratorFunction(input)) generator = input();
    if (!generator) throw `Invalid parameter to fo() ${input}`;

    return new Promise((resolve, reject) => {
      next();

      // Call next() or throw() on the generator as necessary
      function next(v, isError) {
        let res;
        try {
          res = isError ? generator.throw(v) : generator.next(v);
        } catch(error) {
          return reject(error);
        }
        if (res.done) {
          return resolve(res.value);
        }
        toPromise(res.value).then(next, (error) => next(error, true));
      }

      // Convert v to a promise. If invalid, returns a rejected promise
      function toPromise(v) {
        if (isGeneratorFunction(v) || isGenerator(v)) return fo(v);
        if (v.then) return v;
        if (typeof v === 'function') {
          return new Promise((resolve, reject) => {
            v((error, res) => error ? reject(error) : resolve(res));
          });
        }
        if (Array.isArray(v)) return Promise.all(v.map(toPromise));
        return Promise.reject(new Error(`Invalid yield ${v}`));
      }
    });
  };

  return fo;
};

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

      // Call next() or throw() on the generator as necessary
      function next(v, isError) {
        const res = isError ? generator.throw(v) : generator.next(v);
        if (res.done) {
          return;
        }
        handleAsync(res.value);
      }

      // Handle the result the generator yielded
      function handleAsync(async) {
        if (async && async.then) {
          handlePromise(async);
        } else if (typeof async === 'function') {
          handleThunk(async);
        } else {
          next(new Error(`Invalid yield ${async}`), true);
        }
      }

      // If the generator yielded a promise, call `.then()`
      function handlePromise(async) {
        async.then(next, (error) => next(error, true));
      }

      // If the generator yielded a thunk, call it
      function handleThunk(async) {
        async((error, v) => {
          error ? next(error, true) : next(v);
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

  /** @import:content/chapter-2-fo-overview.md */
  it('', (done) => {
    fo(function*() {
      try {
        // First iteration of `next()` stops here,
        // calls `.then()` on the promise
        const res = yield superagent.get('http://doesnot.exist.baddomain');
        // acquit:ignore:start
        assert.ok(false);
        // acquit:ignore:end
      } catch(error) {
        // The promise was rejected, so fo calls `generator.throw()` and
        // you end up here.
      }

      // Second iteration of `next()` stops here, `.then()` on the promise
      const res = yield superagent.get('http://www.google.com');
      res.text;
      // Third iteration of `next()` stops here because generator is done
      // acquit:ignore:start
      assert.ok(res.text);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-fo-retries.md */
  it('', (done) => {
    fo(function*() {
      const url = 'http://doesnot.exist.baddomain';
      const NUM_RETRIES = 3;
      let res;
      let i;
      for (i = 0; i < 3; ++i) {
        try {
          // Going to yield 3 times, and `fo()` will call `generator.throw()`
          // 3 times because superagent will fail every time
          res = yield superagent.get(url);
        } catch(error) { /* retry */ }
      }
      // res is undefined - retried 3 times with no results
      // acquit:ignore:start
      assert.ok(!res);
      assert.equal(i, 3);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-fo-limitations.md */
  it('Limitations', (done) => {
    try {
      fo(function*() {
        // acquit:ignore:start
        try {
        // acquit:ignore:end
        // This will throw an uncaught asynchronous exception
        // and crash the process!
        yield superagent.get('http://doesnot.exist.baddomain');
        // acquit:ignore:start
        assert.ok(false);
        } catch(error) {
          done();
        }
        // acquit:ignore:end
      });
    } catch(error) {
      // This try/catch won't catch the error within the `fo()` call!
      // acquit:ignore:start
      assert.ok(false);
      // acquit:ignore:end
    }
  });

  /** @import:content/chapter-2-fo-nested-generators.md */
  it('', (done) => {
    // Needs to be a generator function so you can `yield` in it.
    const retry = function*(fn, numRetries) {
      for (let i = 0; i < numRetries; ++i) {
        try {
          const res = yield fn();
          return res;
        } catch(error) {}
      }
      throw new Error(`Retried ${numRetries} times`);
    };

    fo(function*() {
      const url = 'http://www.google.com';
      // acquit:ignore:start
      try {
      // acquit:ignore:end
      // Fo's `handleAsync` function will throw because you're
      // yielding a generator function!
      const res = yield retry(() => superagent.get(url), 3);
      // acquit:ignore:start
      assert.ok(false);
      } catch (error) {
        done();
      }
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-fo-parallelism.md */
  it('', (done) => {
    fo(function*() {
      const google = yield superagent.get('http://www.google.com');
      const amazon = yield superagent.get('http://www.amazon.com');
      // acquit:ignore:start
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-fo-real.md */
  it('Real Implementation of Co', (done) => {
    const fo = function(input) {
      const isGenerator = (v) => typeof v.next === 'function';
      const isGeneratorFunction =
        (v) => v.constructor && v.constructor.name === 'GeneratorFunction';

      let generator;
      if (isGenerator(input)) generator = input;
      if (isGeneratorFunction(input)) generator = input();
      if (!generator) throw `Invalid parameter to fo() ${input}`;

      return new Promise((resolve, reject) => {
        next();

        // Call next() or throw() on the generator as necessary
        function next(v, isError) {
          let res;
          try {
            res = isError ? generator.throw(v) : generator.next(v);
          } catch(error) {
            return reject(error);
          }
          if (res.done) {
            return resolve(res.value);
          }
          toPromise(res.value).then(next, (error) => next(error, true));
        }

        // Convert v to a promise. If invalid, returns a rejected promise
        function toPromise(v) {
          if (isGeneratorFunction(v) || isGenerator(v)) return fo(v);
          if (v.then) return v;
          if (typeof v === 'function') {
            return new Promise((resolve, reject) => {
              v((error, res) => error ? reject(error) : resolve(res));
            });
          }
          if (Array.isArray(v)) return Promise.all(v.map(toPromise));
          return Promise.reject(new Error(`Invalid yield ${v}`));
        }
      });
    };
    // acquit:ignore:start
    // fo v2 in action. Note that you're yielding a generator!
    const get = function*() {
      const res = yield superagent.get('http://www.google.com');
      return res.text;
    };
    fo(function*() {
      const html = yield get();
      assert.ok(html);
      done();
    });
    // acquit:ignore:end
  });

  /** @import:content/chapter-2-fo-real-errors.md */
  it('', (done) => {
    // acquit:ignore:start
    const fo = fo2();
    // acquit:ignore:end
    const superagent = require('superagent');

    fo(function*() {
      const html = yield superagent.get('http://doesnot.exist.baddomain');
      // acquit:ignore:start
      assert.ok(false);
      // acquit:ignore:end
    }).then(null, (error) => {
      // Caught the HTTP error!
      // acquit:ignore:start
      assert.ok(error);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-fo-real-errors-catch.md */
  it('', (done) => {
    // acquit:ignore:start
    const fo = fo2();
    // acquit:ignore:end
    const superagent = require('superagent');

    fo(function*() {
      const html = yield superagent.get('http://doesnot.exist.baddomain');
      // acquit:ignore:start
      assert.ok(false);
      // acquit:ignore:end
    }).catch((error) => {
      // Caught the HTTP error!
      // acquit:ignore:start
      assert.ok(error);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-fo-real-errors-2.md */
  it('', (done) => {
    // acquit:ignore:start
    const fo = fo2();
    // acquit:ignore:end
    const superagent = require('superagent');

    fo(function*() {
      const html = yield superagent.get('http://www.google.com');
      // Throws a TypeError, because `html.notARealProperty` is undefined
      const v = html.notARealProperty.test;
      // acquit:ignore:start
      assert.ok(false);
      // acquit:ignore:end
    }).catch((error) => {
      // Caught the TypeError!
      // acquit:ignore:start
      assert.ok(error);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-fo-yield-generators.md */
  it('', (done) => {
    // acquit:ignore:start
    const fo = fo2();
    // acquit:ignore:end
    const get = function*() {
      return (yield superagent.get('http://www.google.com')).text;
    };
    // fo v2 in action. Note that you're yielding a generator!
    fo(function*() {
      // Get the HTML for Google's home page
      const html = yield get();
      // acquit:ignore:start
      assert.ok(html);
      done();
      // acquit:ignore:end
    }).catch((error) => done(error));
  });

  /** @import:content/chapter-2-fo-real-parallelism.md */
  it('', (done) => {
    // acquit:ignore:start
    const fo = fo2();
    // acquit:ignore:end
    const superagent = require('superagent');
    fo(function*() {
      // Parallel HTTP requests!
      const res = yield [
        superagent.get('http://www.google.com'),
        superagent.get('http://www.amazon.com')
      ];
      // acquit:ignore:start
      assert.ok(res[0]);
      assert.ok(res[1]);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-2-wrap-up.md */
  it('', (done) => {
    // acquit:ignore:start
    const handleError = function() {};
    const getCached = function() {};
    const persistToDb = function*() {};
    // acquit:ignore:end
    const co = require('co');
    const superagent = require('superagent');

    co(function*() {
      let res;
      try {
        res = yield superagent.get('http://www.google.com');
      } catch(error) {
        res = getCached();
      }

      // Any errors with this get sent to handleError
      // The `persistToDb()` function is a generator function.
      yield persistToDb(res.text);
      // acquit:ignore:start
      done();
      // acquit:ignore:end
    }).catch(handleError);
  });
});
