# Chapter 5: Moving On

Congratulations! If you've gotten this far, you've seen the fundamentals of
generators and how to implement your own take on co, koa, and regenerator.
Generators are a powerful tool, they enable you to implement scheduling for
CPU-intensive calculations, callback-free asynchronous code, and highly
composable web server applications.

You may have heard of ES2016 and the async/await keywords. The upcoming ES2016
spec will include out-of-the-box support for the callback-free asynchronous
code that `co()` enables.

```javascript
async function googleHomepage() {
  return superagent.get('http://www.google.com');
}
console.log((await googleHomepage()).text);
```

However, ES2016 is not yet finalized. As people who were excited about ES2016's
proposed `Object.observe()` feature learned the hard way, major features are
often changed significantly or even cut entirely before the spec is finalized.
Don't pull all your eggs in the async/await basket until the ES2016 spec is
formally approved! Even when the spec is approved, most browsers will not
support async/await, so you will need a transpiler. Not surprisingly, modern
async/await transpilers use generators and asynchronous coroutines under the
hood.

Congratulations again on completing this guide, and good luck with your
ES2015 coding adventures!
