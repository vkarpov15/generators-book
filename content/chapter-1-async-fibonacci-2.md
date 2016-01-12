However, computing the n-th Fibonacci number synchronously is not a hard
problem without generators. To make things interesting, let's say you wanted
to compute a very large Fibonacci number **without blocking the event loop**.
Normally, a JavaScript for loop would block the event loop. In other words,
no other JavaScript code can execute until the for loop in the previous
example is done. This can get problematic if you want to compute the 100
millionth Fibonacci number in an Express route handler. Without generators,
breaking up a long-running calculation can be cumbersome.

However, since you have a generator function that yields after each iteration
of the for loop, you can call `generator.next()` in a `setInterval()`
function. This will compute the next Fibonacci number with each iteration of
the event loop, and so won't prevent Node.js from responding from incoming
requests. You can make your Fibonacci calculation asynchronous without
changing the generator function!
