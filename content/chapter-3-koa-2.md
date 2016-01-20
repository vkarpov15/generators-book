The goal of this section is to write your own minimal take on koa. Koa is just
a thin layer on top of koa-compose with some HTTP-specific syntactic sugar.
Recall that koa-compose retains the same `this` across all middleware functions.
In order to craft a response to an incoming HTTP request, koa requires you to
set properties on `this`, also known as the koa **context**.

Before you implement your own minimal koa, there's a couple key concepts you
should be aware of. First, generator functions have a context
(the value of the `this` keyword) just like
regular JavaScript functions. The easiest way to call a generator with a
pre-defined value of `this` is the `call()` function defined on every JavaScript
function.

```javascript
const generatorFunction = function*() {
  console.log(this);
};

co(function*() {
  // Will print 'Hello, World!'
  yield generatorFunction.call('Hello, World!');
});
```

The other key concept is the Node.js HTTP package. The ability to start an
HTTP server is part of core Node.js. Here's how you would start an HTTP server
on port 3000 that prints out "Hello, World!" as a response to every request.

```javascript
const http = require('http');
// Create a new server with a request handler. `req` represents
// the request, and `res` represents the response.
const server = http.createServer((req, res) => res.end('Hello, World!'));
// Listen on port 3000
server.listen(3000);
```

<br><br>

The downside of Node.js' vanilla HTTP package is that it doesn't provide an
easy way to compose request handlers. You pass `createServer()` a function
that takes in a request and a response, and you're responsible for figuring
out what that function should be. Koa enables you to use koa-compose to compose
generator functions into a route handler that's compatible with Node.js' HTTP
server package. With that in mind, below is a minimal implementation of koa
that is sufficient to run your basic "Hello, World" example.
