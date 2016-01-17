'use strict';

const assert = require('assert');

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

  it('The koa-compose Module', () => {

  });
});
