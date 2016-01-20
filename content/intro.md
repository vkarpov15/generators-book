# How To Use This Book

This is not just another tech book that sits up on your bookshelf gathering
dust. I think of this ebook as something halfway between a blog post and
a full book: focused and concise like a blog post, in-depth and rigorous like
a pure math textbook. The purpose of this ebook is to take you from a generators
novice to someone who would be comfortable discussing co internals in 1 to 2
hours. This ebook is meant to be read in 1-2 sessions (its only 40 pages!),
although you may also choose to read one chapter at a time.

What is this ebook focused on?

* 80/20 principle. There's a lot of tooling related to generators out there:
transpilers, modules, build systems, etc. This book is focused solely on
generators and other features defined in the ES2015 specification. The **only**
dependency is Node.js >= 4.0.0 and npm.
In particular, this ebook will **not** use webpack, react, babel, gulp, grunt,
TypeScript, CoffeeScript, AngularJS, Dart, or any other framework,
preprocessor, or hype train.
* The co module and asynchronous coroutines. To better understand how generators
work in an asynchronous language like JavaScript, you'll write your own
minimal version of co from scratch. Your co implementation will enable you
to write asynchronous code without callbacks. For instance,

```javascript
const superagent = require('superagent');
co(function*() {
  // Make an HTTP request to google's home page
  const google = (yield superagent.get('http://google.com')).text;
  const regexp = /google/i;
  // The number of times "Google" appears on google.com
  regexp.match(google).length;
});
```

* Composing asynchronous coroutines. You'll learn about the generator-based
server-side web framework koa, and write your own minimal koa implementation.
