The key decision that makes co 4.x overcome all the limitations of fo v1 is
that the `co()` function itself returns a promise, and converts all
asynchronous operations into promises. If fo() returns a promise, then you
can handle the case where the generator yields a generator function by just
calling fo() on the yielded generator function. Promises also provide a
mechanism for handling errors: the `reject()` function. You can wrap your
calls to `generator.next()` and `generator.throw()` in a try/catch, and reject
the promise if the generator threw. Below is the implementation of fo v2,
which uses promises internally and returns a promise.
