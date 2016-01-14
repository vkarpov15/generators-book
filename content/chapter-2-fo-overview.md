<br><br><br>

Let's take a closer look at how the `fo()` function works. The first step is
to create a generator from the provided generator function. Once you have
a generator, you need to use the `next()` function to kick off the generator's
execution. The `next()` function calls `generator.next()` to start off the
generator. Any time the generator yields, the `fo()` function calls
`handleAsync()`, which is responsible for handling the asynchronous operations
the generator yields. In particular, `handlePromise()` handles any promises
that the generator yields, and `handleThunk()` handles any thunks.

Let's see how `fo()` works with a simple error. In the below example, you make
an HTTP request to a nonexistent URL. Superagent will fail, and so the
promise calls its `onRejected()` function. The `fo()` function will then call
`next()` with `isError` set to true. The internal `next()` function then
calls `generator.throw()` to trigger an error in the generator, which you
can then try/catch.
