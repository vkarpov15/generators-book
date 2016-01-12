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

  describe('For/Of Loops', () => {
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

    /** @import:content/chapter-1-for-of-1.md */
    it('', () => {
      let fibonacci = fibonacciGenerator(10);
      // acquit:ignore:start
      let p1 = 0;
      let p2 = 1;
      // acquit:ignore:end
      for (const x of fibonacci) {
        x; // 1, 1, 2, 3, 5, ..., 55
        // acquit:ignore:start
        assert.equal(p1 + p2, x);
        p1 = p2;
        p2 = x;
        // acquit:ignore:end
      }
    });

    /** @import:content/chapter-1-for-of-iterators.md */
    it('Iterators and Iterables', () => {
      let iterable = {};

      // acquit:ignore:start
      assert.throws(function() {
      // acquit:ignore:end
      for (const x of iterable) {} // Throws an error
      // acquit:ignore:start
      });
      // acquit:ignore:end

      // But once you add a Symbol.iterator property, everything works!
      iterable[Symbol.iterator] = function() {
        return fibonacciGenerator(10);
      };
      // acquit:ignore:start
      let p1 = 0;
      let p2 = 1;
      // acquit:ignore:end
      for (const x of iterable) {
        x; // 1, 1, 2, 3, 5, ..., 55
        // acquit:ignore:start
        assert.equal(p1 + p2, x);
        p1 = p2;
        p2 = x;
        // acquit:ignore:end
      }
    });

    /** @import:content/chapter-1-for-of-symbols.md */
    it('A Brief Overview of Symbols', () => {
      Symbol.iterator; // Symbol(Symbol.iterator)

      let iterable = {};
      iterable[Symbol.iterator] = function() {
        return fibonacciGenerator(10);
      };

      iterable.iterator; // undefined
      Object.keys(iterable); // Empty array!
      // acquit:ignore:start
      assert.strictEqual(iterable.iterator, undefined);
      assert.deepEqual(Object.keys(iterable), []);
      // acquit:ignore:end
    });

    /** @import:content/chapter-1-for-of-generators.md */
    it('Iterables and Generators', () => {
      const fibonacci = fibonacciGenerator(10);
      fibonacci[Symbol.iterator]() === fibonacci; // true
      // acquit:ignore:start
      assert.ok(fibonacci[Symbol.iterator]() === fibonacci);
      // acquit:ignore:end
      for (const x of fibonacci) {
        // 1, 1, 2, 3, 5, ..., 55
      }
      for (const x of fibonacci) {
        // Doesn't run!
        // acquit:ignore:start
        assert.ok(false);
        // acquit:ignore:end
      }
    });
  });

  describe('Error Handling', () => {
    /** @import:content/chapter-1-exceptions-1.md */
    it('', () => {
      const generatorFunction = function*() {
        throw new Error('oops!');
      };

      const generator = generatorFunction();
      // acquit:ignore:start
      assert.throws(function() {
      // acquit:ignore:end

      // throws an error
      generator.next();

      // acquit:ignore:start
      });
      // acquit:ignore:end
    });

    /** @import:content/chapter-1-exceptions-stack.md */
    it('', (done) => {
      const generatorFunction = function*() {
        throw new Error('oops!');
      };

      const generator = generatorFunction();

      setTimeout(() => {
        try {
          generator.next();
        } catch(err) {
          /**
           * Error: oops!
           * at generatorFunction (book.js:2:15)
           * at next (native)
           * at null._onTimeout (book.js:18:21)
           * at Timer.listOnTimeout (timers.js:89:15)
           */
          err.stack;
          // acquit:ignore:start
          done();
          // acquit:ignore:end
        }
      }, 0);
    });

    /** @import:content/chapter-1-exceptions-throw.md */
    it('Re-entry With Error', () => {
      const fakeFibonacciGenerator = function*() {
        try {
          yield 3;
          // acquit:ignore:start
          assert.ok(false);
          // acquit:ignore:end
        } catch(error) {
          error; // Error: Expected 1, got 3
          // acquit:ignore:start
          assert.equal(error.toString(), 'Error: Expected 1, got 3');
          // acquit:ignore:end
        }
      };
      const fibonacci = fakeFibonacciGenerator();

      const x = fibonacci.next();
      fibonacci.throw(new Error(`Expected 1, got ${x.value}`));
      // { value: undefined, done: true }
      fibonacci.next();
    });
  });

  describe('Case Study: Handling Async Errors', () => {
    /** @import:content/chapter-1-async-errors.md */
    it('', () => {
      const generatorFunction = function*() {
        const fullName = yield ['John', 'Smith'];
        fullName; // 'John Smith'
        // acquit:ignore:start
        assert.equal(fullName, 'John Smith');
        // acquit:ignore:end
      };

      const generator = generatorFunction();
      // Execute up to the first `yield`
      const next = generator.next();
      // Join ['John', 'Smith'] => 'John Smith' and use it as the
      // result of `yield`, then execute the rest of the generator function
      generator.next(next.value.join(' '));
    });

    /** @import:content/chapter-1-async-errors-2.md */
    it('', (done) => {
      const async = function(callback) {
        setTimeout(() => callback(null, 'Hello, Async!'), 10);
      };

      const generatorFunction = function*() {
        const v = yield async;
        v; // 'Hello, Async!'
        // acquit:ignore:start
        assert.equal(v, 'Hello, Async!');
        // acquit:ignore:end
      };

      const generator = generatorFunction();
      const fn = generator.next();
      fn(function(error, res) {
        generator.next(res);
        // acquit:ignore:start
        done();
        // acquit:ignore:end
      });
    });

    /** @import:content/chapter-1-async-errors-3.md */
    it('', (done) => {
      const async = function(callback) {
        setTimeout(() => callback(new Error('Oops!')), 10);
      };

      const generatorFunction = function*() {
        try {
          yield async;
          // acquit:ignore:start
          assert.ok(false);
          // acquit:ignore:end
        } catch(error) {
          error; // Error: Oops!
          // acquit:ignore:start
          assert.equal(error.toString(), 'Error: Oops!');
          // acquit:ignore:end
        }
      };

      const generator = generatorFunction();
      const fn = generator.next();
      fn(function(error, res) {
        generator.throw(error);
        // acquit:ignore:start
        done();
        // acquit:ignore:end
      });
    });
  });
});
