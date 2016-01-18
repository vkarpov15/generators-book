Co and the notion of asynchronous coroutines enable you to write asynchronous
code with cleaner syntax. However, co is useful for more than just writing
HTTP requests without callbacks. As you saw in the "Real Implementation of Co"
section, co supports generators as an asynchronous primitive. You used this
idea to write helper functions that were also generators. The idea of yielding
generators is useful for composing asynchronous functions, which leads to the
idea of middleware.

The concept of **middleware** in JavaScript is a sequence of functions where
one function is responsible for calling the next function in the sequence.
If you've used the Express web framework, you may have seen Express-style
middleware.

```javascript
const app = require('express');

const middlewareFn = function(req, res, next) {
  // A middleware function takes in the request and response,
  // transforms them, and calls `next()` to trigger the next
  // function in the middleware chain.
  next();
};

app.use(middlewareFn);
```

Express relies heavily on middleware. Even routing is implemented as middleware
in Express. However, this middleware paradigm has numerous limitations. The
most significant limitation is the fact that a middleware function has no way
of knowing when rest of the middleware chain is complete. For instance, suppose
you wanted to compute how long a request took in Express.

```javascript
app.use((req, res, next) => {
  // next() is async and does not return a promise, nor does it
  // take a callback.
  next();
});
```

The `next()` call fires off the next middleware in the chain, but there is no
way for the middleware function above to know when `next()` is done.
However, suppose your middleware functions were generator functions rather
than regular functions, and suppose `next()` returned a promise. If you
wrapped the middleware generator functions in a `co()` call, you would now
have the ability to compose asynchronous coroutines: the first coroutine calls
the second and so on, and then the first coroutine picks up where it left off
after the second is done. This is what the koa-compose module does.
