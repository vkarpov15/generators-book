Remember that there are two functions involved in generator functions: the
generator function itself, and the function that calls `next()` on the
generator object. So far in this book, the function that calls `next()`
hasn't done any real work. The most complex example is the async Fibonacci
example, which acted as a scheduler for the Fibonacci generator.

One pivotal feature of generators is that the `next()` function can take
a parameter. That parameter then becomes the return value of the `yield`
statement in the generator function itself!
