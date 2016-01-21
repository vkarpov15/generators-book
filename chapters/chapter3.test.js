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

  /** @import:content/chapter-3-koa.md */
  it('The Koa Web Framework', done => {
    const koa = require('koa');
    // Create a new koa app
    const app = koa();
    // Each app has its own sequence of middleware. The `.use()`
    // function adds a generator function to the middleware chain.
    app.use(function*(next) {
      // `superagent.get('http://localhost:3000');` will now
      // return 'Hello, World!'
      this.body = 'Hello, World!';
    });
    const server = app.listen(3000);
    // acquit:ignore:start
    co(function*() {
      const superagent = require('superagent');
      const res = yield superagent.get('http://localhost:3000');
      assert.equal(res.text, 'Hello, World!');
      server.close();
      done();
    });
    // acquit:ignore:end
  });

  /** @import:content/chapter-3-koa-2.md */
  it('', done => {
    const http = require('http');
    const co = require('co');
    const compose = require('koa-compose');

    // The minimal koa implementation
    const koa = function() {
      // List of middleware
      let middleware = [];

      // The real work is in this function, which creates the
      // actual HTTP server
      const listen = (port) => {
        // First, koa-compose all the middleware together
        const composedMiddleware = compose(middleware);
        // Create a server with a co-based request handler
        const server = http.createServer((req, res) => {
          co(function*() {
            const context = {};
            // Execute all the middleware using the empty context object
            yield composedMiddleware.call(context);
            // Once the middleware is done, send the request body
            res.end(context.body);
          });
        });
        return server.listen(port);
      };

      return {
        // The `use()` function just adds a new generator function to
        // the list of middleware
        use: (middlewareFn) => middleware.push(middlewareFn),
        listen: listen
      };
    };

    // Create a new koa app
    const app = koa();
    // Each app has its own sequence of middleware. The `.use()`
    // function adds a generator function to the middleware chain.
    app.use(function*(next) {
      // `superagent.get('http://localhost:3000');` will now
      // return 'Hello, World!'
      this.body = 'Hello, World!';
    });
    const server = app.listen(3000);
    // acquit:ignore:start
    co(function*() {
      const superagent = require('superagent');
      const res = yield superagent.get('http://localhost:3000');
      assert.equal(res.text, 'Hello, World!');
      server.close();
      done();
    });
    // acquit:ignore:end
  });

  /** @import:content/chapter-3-koa-errors.md */
  it('', (done) => {
    const koa = require('koa');
    const superagent = require('superagent');
    const app = koa();

    // The first middleware is an error handler: if any subsequent
    // middleware throws an error, this try/catch will handle it.
    app.use(function*(next) {
      try {
        yield next;
      } catch(error) {
        this.body = error.toString();
        this.status = 500;
      }
    });

    // So if google.com is down, this middleware will throw an error,
    // and the above middleware will report it as an HTTP 500.
    app.use(function*(next) {
      this.body = (yield superagent.get('http://www.google.com')).text;
      yield next;
    });

    const server = app.listen(3000);
    // acquit:ignore:start
    server.close();
    done();
    // acquit:ignore:end
  });

  /** @import:content/chapter-3-limitations.md */
  it('Limitations of koa-compose and Koa', (done) => {
    const compose = require('koa-compose');

    const middleware1 = function*(next) {
      const res = yield next;
      return res + 'World!';
    };

    const middleware2 = function*(next) {
      return 'Hello, ';
    };

    co(function*() {
      const res = yield compose([middleware1, middleware2])();
      // res is undefined!
      // acquit:ignore:start
      assert.ok(!res);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-3-koa-limitations.md */
  it('', (done) => {
    // acquit:ignore:start
    const koa = () => {
      return { use: () => true, listen: () => true };
    };
    // acquit:ignore:end
    const app = koa();
    // In koa 2.x, you can use arrow functions as middleware
    app.use((ctx) => {
      ctx.body = 'Hello, World!';
    });
    const server = app.listen(3000);
    // acquit:ignore:start
    done();
    // acquit:ignore:end
  });
});
