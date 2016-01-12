The error's stack trace reflects the fact that `next()` was the function
that called the function that threw the error. In particular, if you call
`next()` asynchronously, you will lose the original stack trace.
