When you think of generators, you need to think of 2 functions: the generator
function itself, and the function that's calling `next()` on the generator.
When the generator function calls `yield` or `return`, the calling function
regains control. When the calling function calls `next()`, the generator
function regains starts running again. There's another way the calling function
can give control back to the generator function: the `throw()` function.

<br><br><br><br>

The `throw()` function is a way for the calling function to tell the generator
function that something went wrong. In the generator function, this will look
like the `yield` statement threw an error. You can then use try/catch to
handle the error in the generator function. As you'll see in the next section,
this pattern is indispensable for working with asynchronous code and generators.
