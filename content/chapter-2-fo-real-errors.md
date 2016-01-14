<br><br>

Let's take a look at how this new version of fo resolves the major limitations
of the first version. First off, let's take a look at error handling. The key
idea for error handling in fo is the below code.

```javascript
let res;
try {
  res = isError ? generator.throw(v) : generator.next(v);
} catch (error) {
  return reject(error);
}
```

The `fo()` function may be asynchronous, but every error that can occur in your
generator function happens synchronously in the above try block. For instance,
suppose you made an HTTP request to a bad URL and didn't wrap your
`superagent.get()` call in a try/catch. In that case, fo will reject the
promise and trigger your `onRejected` handler.
