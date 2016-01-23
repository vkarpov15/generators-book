Let's take a look at a more challenging problem that will be more useful for
your rudimentary transpiler: count the number of `yield` statements in each
generator function. For instance, in the previous example, you had 2 generator
functions, each with 1 yield statement.

```javascript
const generatorFunction = function*() {
  yield function*() {
    yield 'Hello, World!';
  };
};
```

For this example, the correct output would be `[1, 1]`, because both the first
and the second generator functions have 1 yield statement. What about a
trickier case?

```javascript
const generatorFunction = function*() {
  yield function*() {
    yield 'Hello, World!';
  };
  yield 'Hello, World!';
};
```

The correct output is `[2, 1]` because the first generator function has 2
yield statements. However, estraverse will visit the 2nd yield statement
after the 2nd generator function.

<br>

To properly handle the case where you `yield` a generator and then `yield`
another value, you're going to use a stack and the estraverse `leave()`
function as shown below.
