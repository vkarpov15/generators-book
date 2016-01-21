Koa 1.x has several limitations. In this section, you'll learn about 2
common complaints about koa 1.x that are resolved in koa 2.x.

The first limitation is that the entire API for structuring your HTTP response
is based on generators. As a matter of fact, if you pass anything other
than a generator function to `app.use()`, koa will throw an error.

```javascript
const koa = require('koa');
const app = koa();
// Throws 'AssertionError: app.use() requires a generator function'
app.use(() => { this.body = 'Hello, World' });
// Throws 'AssertionError: app.use() requires a generator function'
app.use(function() { this.body = 'Hello, World' });
```

Generators are a powerful feature, but not right for all use cases. For
instance, the upcoming ES2016 JavaScript language standard will support the
`async` and `await` keywords, which will enable you to write asynchronous
code without callbacks in the same way that `co` and `yield` do. Also, since
ES5 doesn't support generators, running koa in ES5 environments is difficult.

The way that koa 2.x works around this limitation is similar to the approach
you used to overcome the limitations of your minimal v1 implementation of co:
just use promises for everything.

<br><br><br>

In koa 2.x, the `next` parameter to your
middleware is not a generator function: it's a plain-old function that returns
a promise.

```javascript
app.use(function(ctx, next) {
  next().then(function(res) {
    // Executed after the rest of the middleware is done
    ctx.body = 'Hello, World!';
  });
});
```

In addition to co, promises work with the ES2016 `async` and `await`
keywords and are usable in ES5.

The above example also hints at the second limitation of koa 1.x: relying
on the `this` keyword. The `this` keyword is notorious for making JavaScript
beginners' lives difficult. Instead of using `this`, koa 2.x passes a
'context' parameter (commonly abbreviated `ctx`) as the first parameter to
your middleware function. The koa 2.x `ctx` parameter is analogous to the
koa 1.x `this` keyword.
