In chapter 1, you saw how to `yield` an asynchronous function from a generator.
The calling function would then execute the asynchronous function and resume
the generator function when the asynchronous function was done. This pattern
is an instance of an old (1958) programming concept known as a coroutine.
A **coroutine** is a function that can suspend its execution and defer to
another function. As you might have guessed, generator functions are coroutines,
and the `yield` statement is how a generator function defers control to another
function. You can think of a coroutine as two functions running side-by-side,
deferring control to each other at predefined points.

So why are coroutines special? In JavaScript, you typically need to specify a
callback for asynchronous operations. For instance, if you use the `superagent`
HTTP library to make an HTTP request to Google's home page, you would use code
similar to what you see below.

```javascript
superagent.get('http://google.com', function(error, res) {
  // Handle error, use res
});
```

By yielding asynchronous operations, you can write asynchronous operations
without callbacks. However, remember that a coroutine involves two functions:
the generator function, and the function that calls `next()` on the generator.
When your generator function yields an asynchronous operation, the calling
function needs to handle the asynchronous operation and resume the generator
when the asynchronous operation completes.

The most popular library for handling generator functions that yield
asynchronous operations is called co. Here's what getting the HTML for Google's
home page looks like in co. Looks cool, right? The below code is still
asynchronous, but looks like synchronous code. In this chapter, you'll learn
about how co works by writing your own co.
