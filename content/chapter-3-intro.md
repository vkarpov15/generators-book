Co and the notion of asynchronous coroutines enable you to write asynchronous
code with cleaner syntax. However, co is useful for more than just writing
HTTP requests without callbacks. As you saw in the "Real Implementation of Co"
section, co supports generators as an asynchronous primitive. You used this
idea to write helper functions that were also generators. The idea of yielding
generators is useful for composing asynchronous functions, which leads to the
idea of middleware.

The concept of **middleware** in JavaScript is a sequence of functions where
one function is responsible for calling the next function in the sequence.
Conventional ES5-style middleware has the below form.

```javascript
const middlewareFn = function(req, res, next) {
  // A middleware function takes in the request and response,
  // transforms them, and calls `next()` to trigger the next
  // function in the middleware chain.
  next();
};
```

However, this function composition paradigm has numerous limitations. Once a
middleware function calls `next()`, it defers control to the next function
in the sequence. There is no way for the next function to return any values
or defer control back to the previous middleware. In other words, what if
you wanted to write a middleware function that reported how long the
rest of the sequence of functions took to complete?

```javascript
const middlewareFn = (req, res, next) => {
  // next() is async and does not return a promise, nor does it
  // take a callback.
  next();
};
```

The `next()` call fires off the next middleware in the chain, but there is no
way for the middleware function above to know when `next()` is done.
However, suppose your middleware functions were generator functions rather
than regular functions, and suppose `next()` returned a promise. If you
wrapped the middleware generator functions in a `co()` call, you would now
have the ability to compose asynchronous coroutines: the first coroutine calls
the second and so on, and then the first coroutine picks up where it left off
after the second is done.

<br><br><br><br><br><br><br><br><br>

The generator-based function composition library koa-compose does exactly
this. The `next` parameter is a generator function that triggers the next
generator in the sequence. In the below example, `middleware1` yields
next to defer control to `middleware2`, which takes approximately 100ms
to run, and picks up where it left off after `middleware2` is done.
