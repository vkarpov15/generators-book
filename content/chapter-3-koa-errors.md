<br><br>

The real implementation of koa includes many more features, but the fundamental
idea is similar to the previous implementation. In particular, the request
handler koa 1.x passes to the Node.js `http.createServer()` function is just
the result of running koa-compose on the app's middleware plus
post-processing to translate the `context` object into an HTTP response.

For instance, the real implementation of koa exposes the request and response
objects on the request context. In the minimal koa implementation, your
middleware doesn't know anything about incoming requests, which makes it
impossible to craft a real response. Supporting
this feature would look like what you see below.

```javascript
// Create a server with a co-based request handler
const server = http.createServer((req, res) => {
  co(function*() {
    // Expose req and res by default
    const context = { req: req, res: res };
    // Execute all the middleware using the empty context object
    yield composedMiddleware.call(context);
    // Once the middleware is done, send the request body
    res.end(context.body);
  });
});
```

Koa's middleware approach has some neat features. For instance, it is difficult
to define a catch-all error handler in web frameworks like Express. However, in
koa, defining an error handler is a trivial application of try/catch.
