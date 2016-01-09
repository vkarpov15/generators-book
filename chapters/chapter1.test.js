'use strict';

const assert = require('assert');

describe('Chapter 1: Getting Started', function() {
  describe('', function() {
    /** @import:content/chapter-1-intro.md */
    it('', function() {
      const generatorFunction = function*() {
        let message = 'Hello';
        yield message;
        message += ', World!';
        yield message;
      };

      const generator = generatorFunction();
      // { value: 'Hello', done: false };
      const v1 = generator.next();

      // acquit:ignore:start
      assert.deepEqual(v1, { value: 'Hello', done: false });
      // acquit:ignore:end
      // { value: 'Hello, World!', done: false }
      const v2 = generator.next();
      // acquit:ignore:start
      assert.deepEqual(v2, { value: 'Hello, World!', done: false });
      // acquit:ignore:end
      // { value: undefined, done: true }
      const v3 = generator.next();
      // acquit:ignore:start
      assert.deepEqual(generator.next(),
        { value: undefined, done: true });
      // acquit:ignore:end
    });

    /** @import:content/chapter-1-re-entry.md */
    it('Re-entry', function(done) {
      const generatorFunction = function*() {
        let i = 0;
        while (i < 3) {
          yield i;
          ++i;
        }
      };

      const generator = generatorFunction();

      let x = generator.next(); // { value: 0, done: false }
      // acquit:ignore:start
      assert.deepEqual(x, { value: 0, done: false });
      // acquit:ignore:end
      setTimeout(() => {
        x = generator.next(); // { value: 1, done: false }
        // acquit:ignore:start
        assert.deepEqual(x, { value: 1, done: false });
        // acquit:ignore:end
        x = generator.next(); // { value: 2, done: false }
        // acquit:ignore:start
        assert.deepEqual(x, { value: 2, done: false });
        // acquit:ignore:end
        x = generator.next(); // { value: undefined, done: true }
        // acquit:ignore:start
        assert.deepEqual(x, { value: undefined, done: true });
        done();
        // acquit:ignore:end
      }, 50);
    });

    /**
     * You may be wondering what happens when you use `return`
     * instead of `yield` in a generator. As you might expect,
     * `return` behaves similarly to `yield`, except for
     * `done` is set to true.
     */
    it('`yield` vs `return` revisited', () => {
      const generatorFunction = function*() {
        return 'Hello, World!';
      };

      const generator = generatorFunction();

      // { value: 'Hello, World!', done: true }
      const v = generator.next();
      // acquit:ignore:start
      assert.deepEqual(v, { value: 'Hello, World!', done: true });
      // acquit:ignore:end
    });
  });

  describe('Case Study: Async Fibonacci', () => {
    /** @import:content/chapter-1-async-fibonacci.md */
    it('', () => {
      // acquit:ignore:start
      const fibonacciGenerator = function*(n) {
        let back2 = 0;
        let back1 = 1;
        let cur = 1;
        for (let i = 0; i < n - 1; ++i) {
          cur = back2 + back1;
          back2 = back1;
          back1 = cur;
          yield cur;
        }

        return cur;
      };
      // acquit:ignore:end
      const fibonacci = fibonacciGenerator(10);
      let it;
      for (it = fibonacci.next(); !it.done; it = fibonacci.next()) {
      }
      it.value; // 55, the 10th fibonacci number
      // acquit:ignore:start
      assert.equal(it.value, 55);
      // acquit:ignore:end
    });

    /** @import:content/chapter-1-async-fibonacci-2.md */
    it('', done => {
      // acquit:ignore:start
      const fibonacciGenerator = function*(n) {
        let back2 = 0;
        let back1 = 1;
        let cur = 1;
        for (let i = 0; i < n - 1; ++i) {
          cur = back2 + back1;
          back2 = back1;
          back1 = cur;
          yield cur;
        }

        return cur;
      };
      // acquit:ignore:end
      const fibonacci = fibonacciGenerator(10);
      // And compute one new Fibonacci number with each iteration
      // through the event loop.
      const interval = setInterval(() => {
        const res = fibonacci.next();
        if (res.done) {
          clearInterval(interval);
          res.value; // 55, the 10th fibonacci number
          // acquit:ignore:start
          assert.equal(res.value, 55);
          done();
          // acquit:ignore:end
        }
      }, 0);
    });
  });
});
