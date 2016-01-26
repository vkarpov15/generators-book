<br><br><br><br>

Why does thunkify lose the function's value of `this`? Because in JavaScript, calling `a.b();` is different from `var c = a.b; c();`.
When you call a function as a member, like the `a.b();` case, `this` will equal
`a` in the function call. However, `var c = a.b; c();` does not call a function
as a member, so `this` refers to the global object in `c`. The latter case
also applies when you pass a function as a parameter to another function,
like you do with `thunkify()`.

There are ways to make thunkify work better. For instance, in the previous
example, you could use `.bind()`.

```javascript
const res = yield thunkify(test.async.bind(test))();
```

However, `bind()` gets to be very confusing when you have _chained_ function
calls. A chained function call takes the form `a.b().c().d()`, and the `b()`,
`c()`, and `d()` function calls are "chained" together. This API pattern
is often used in JavaScript for building up complex objects, like HTTP requests
or MongoDB queries. For instance, superagent has a chainable API for building
up HTTP requests.

```javascript
// Create an arbitrary complex HTTP request to show how superagent's
// request builder works.
superagent.
  get('http://google.com').
  // Set the HTTP Authorization header
  set('Authorization', 'MY_TOKEN_HERE').
  // Only allow 5 HTTP redirects before failing
  redirects(5).
  // Add `?color=blue` to the URL
  query({ color: blue }).
  // Send the request
  end(function(error, res) {});
```

Let's say you wanted to thunkify the above code. Where would you need to use
`.bind()` and what would you need to `bind()` to? The answer is not obvious
unless you read superagent's code. You need to `bind()` to
the return value of `superagent.get()`.

```javascript
co(function*() {
  const req = superagent.get('http://google.com');
  const res = yield thunkify(req.query({ color: blue }).end.bind(req));
});
```

Thunkify and thunks in general are an excellent fallback, but co
supports a better asynchronous primitive: promises. A **promise** is an
object that has a `.then()` function that takes two functions as parameters.

* `onFulfilled`: called if the asynchronous operation succeeds.
* `onRejected`: called if the asynchronous operation failed.

<br><br><br><br>

You can think of promises as an object wrapper around a single
asynchronous operation. Once you call `.then()`, the asynchronous
operation starts. Once the asynchronous operation completes,
the promise then calls either `onFulfilled` or `onRejected`.

For example, each function call in the superagent
HTTP request builder returns a promise that you can `yield`.

```javascript
co(function*() {
  // `superagent.get()` returns a promise, because the `.then` property
  // is a function.
  superagent.get('http://www.google.com').then;
  co(function*() {
    // Works because co is smart enough to look for a `.then()` function
    const res = yield superagent.
      get('http://www.google.com').
      query({ color: 'blue' });
  });
});
```

Much easier than using thunkify! More importantly, you don't have to worry
about messing up the value of `this` because you aren't passing a function as
a parameter. The downside of promises, though, is that you rely on the function
itself to return a promise. When you use thunkify, you make no assumptions
about the return value of the function you're calling. However, many popular
Node.js libraries, like superagent, the redis driver, and the MongoDB driver,
all have the ability to return promises for asynchronous operations.

Creating your own promises is easy. Promises are a core part of ES2015, so
you don't have to include any libraries. Below is an example of how to create
an ES2015 promise. The `Promise` constructor takes a single function,
called a **resolver**, which takes two function parameters, `resolve` and
`reject`. The resolver is responsible for executing the asynchronous
operation and calling `resolve()` if the operation succeeded or `reject()`
if it failed.

```javascript
// The resolver function takes 2 parameters, a `resolve()` function
// and a `reject()` function.
const resolver = function(resolve, reject) {
  // Call `resolve()` asynchronously with a value
  setTimeout(() => resolve('Hello, World!'), 5);
};
const promise = new Promise(resolver);
promise.then(function(res) {
  // The promise's `onFulfilled` function gets called with
  // the value the resolver passed to `resolve()`. In this
  // case, the string 'Hello, World!'
  res;
});
```

<br><br><br><br><br>

Promises are a deep subject and what you've seen thus far is just the tip of
the iceberg. To use co, all you need to know is that
a promise is an object with a `.then()` function that takes 2 function
parameters: `onFulfilled` and `onRejected`. For instance, below is an example
of a minimal promise that's compatible with co.
