The most important detail to note about generators and iterables is that
_generator objects_ are iterables, not _generator functions_. In order words,
you can't run a for/of loop on a generator function.

```javascript
fibonacciGenerator[Symbol.iterable]; // Undefined
fibonacciGenerator(10)[Symbol.iterable]; // Function

for (const x of fibonacciGenerator) {} // Error!
for (const x of fibonacciGenerator(10)) {} // Ok
```

You may find it strange that the generators are iterable but generator
functions are not. One reason for this decision is that a generator function can
take parameters. For instance, looping over `fibonacciGenerator(10)` would not
give the same results as looping over `fibonacciGenerator(11)`.

The second most important detail to note about generators and iterables
is that `generator[Symbol.iterator]` is a function that returns the
generator itself. This means that you can't loop over the same generator
twice. Once a generator is done, subsequent for/of loops will exit immediately.
