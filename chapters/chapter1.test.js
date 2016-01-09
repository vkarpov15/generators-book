'use strict';

const assert = require('assert');

describe('Chapter 1: Getting Started', function() {
  describe('What is a Generator?', function() {
    /** @import:content/chapter-1-intro.md */
    it('', function() {
      const generatorFunction = function*() {
        let message = 'Hello';
        yield message;
        message += ', World!';
        yield message;
      }();

      const generator = generatorFunction();
      // { value: 'Hello', done: false };
      const v1 = generator.next();
      
      // acquit:ignore:start
      assert.deepEqual(generator.next(), { value: 'Hello', done: false });
      // acquit:ignore:end
      // { value: 'Hello, World!', done: false }
      const v2 = generator.next();
      // acquit:ignore:start
      assert.deepEqual(generator.next(),
        { value: 'Hello, World!', done: false });
      // acquit:ignore:end
      // { value: undefined, done: true }
      const v3 = generator.next();
      // acquit:ignore:start
      assert.deepEqual(generator.next(),
        { value: undefined, done: true });
      // acquit:ignore:end
    });
  });
});
