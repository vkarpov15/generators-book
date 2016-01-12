Now suppose that the `async` function returns an error. The calling function
can then call `throw()` on the generator, and now your generator function
can handle this asynchronous operation with try/catch! As you'll see in the
coroutines chapter, this idea is the basis of the co library.
