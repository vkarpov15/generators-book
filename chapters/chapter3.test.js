'use strict';

const assert = require('assert');
const co = require('co');
const compose = require('koa-compose');

describe('Chapter 3: Koa and Middleware', function() {
  /** @import:content/chapter-3-intro.md */
  it('', (done) => {
    const co = require('co');
    const compose = require('koa-compose');

    const middleware1 = function*(next) {
      const start = Date.now();
      yield next;
      // Approximately 100
      const end = Date.now() - start;
      // acquit:ignore:start
      assert.ok(end > 95 && end < 110);
      done();
      // acquit:ignore:end
    };

    const middleware2 = function*(next) {
      // Yield a thunk that gets resolved after 100 ms
      yield callback => setTimeout(() => callback(), 100);
      yield next;
    };

    co(function*() {
      yield compose([middleware1, middleware2])();
    });
  });

  /** @import:content/chapter-3-compose-overview.md */
  it('The koa-compose Module', (done) => {
    // acquit:ignore:start
    const co = require('co');
    // acquit:ignore:end
    const compose = function(middleware) {
      const noop = function*() {};
      // compose returns a generator
      return function*() {
        let i = middleware.length;
        let next = noop;
        while (i--) {
          // Loop over generators from last to first. The `next` passed
          // to the i-th generator function is the (i+1)-th generator.
          next = middleware[i](next);
        }
        yield next;
      };
    };
    // acquit:ignore:start
    const middleware1 = function*(next) {
      const start = Date.now();
      yield next;
      // Approximately 100
      const end = Date.now() - start;
      assert.ok(end > 95 && end < 110);
      done();
    };

    const middleware2 = function*(next) {
      // Yield a thunk that gets resolved after 100 ms
      yield callback => setTimeout(() => callback(), 100);
      yield next;
    };
    co(function*() {
      yield compose([middleware1, middleware2])();
    });
    // acquit:ignore:end
  });

  /** @import:content/chapter-3-compose-errors.md */
  it('', (done) => {
    const co = require('co');
    const compose = require('koa-compose');

    const middleware1 = function*(next) {
      throw new Error('oops');
    };

    const middleware2 = function*(next) {
      // never get here
      // acquit:ignore:start
      assert.ok(false);
      // acquit:ignore:end
    };

    co(function*() {
      // This will throw an error
      yield compose([middleware1, middleware2])();
    }).catch(error => {
      // Error: oops
      // acquit:ignore:start
      assert.ok(error);
      assert.ok(/oops/.test(error.toString()));
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-3-compose-try.md */
  it('', (done) => {
    let error;
    const middleware1 = function*(next) {
      try {
        // The `middleware2` generator function throws...
        yield next;
      } catch(err) {
        // which triggers this try/catch and records the error
        error = err;
      }
    };

    const middleware2 = function*(next) {
      throw new Error('Will get caught');
    };

    co(function*() {
      // `res` will be -1 since the final value returned by middleware1
      // is -1
      yield compose([middleware1, middleware2])();
      // error is now 'Error: Will get caught'
      // acquit:ignore:start
      assert.ok(/Will get caught/.test(error.toString()));
      done();
      // acquit:ignore:end
    });
  });
});
