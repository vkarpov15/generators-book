The fact that you can execute `generator.next()` asynchronously hints at
why generators are so useful. You can execute `generator.next()` synchronously
or asynchronously without changing the implementation of the generator
function.

For instance, lets say you wrote a generator
function that computes the Fibonacci Sequence. Note that generator functions
can take parameters like any function.

```javascript
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
```

You could compute the n-th Fibonacci number synchronously using the code
below.
