Once you combine this feature with the `throw()` function, you have everything
you need to have the generator function `yield` whenever it needs to do
an asynchronous operation. The calling function can then execute the
asynchronous operation, `throw()` any errors that occurred, and return the
result of the async operation using `next()`.

<br><br><br>

This means that your generator function doesn't need to worry about callbacks.
The calling function can be responsible for running asynchronous operations
and reporting any errors back to the generator function. For instance,
the below example shows how to run a generator function that yields an
asynchronous function without any errors.
