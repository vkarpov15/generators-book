# How To Use This Book

This is not just another tech book that sits up on your bookshelf gathering
dust. I think of this ebook as something halfway between a blog post and
a full book: focused and concise like a blog post, in-depth and rigorous like
a pure math textbook. The purpose of this ebook is to take you from a generators
novice to someone who would be comfortable discussing co internals in 1 to 2
hours. This ebook is meant to be read in 1-2 sessions (its only 50 pages!),
although you may also choose to read one chapter at a time.

What is this ebook focused on?

* 80/20 principle. There's a lot of tooling related to generators out there:
transpilers, modules, build systems, etc. This book is focused solely on
generators and other features defined in the ES2015 specification. The **only**
dependency is Node.js >= 4.0.0 and npm.
In particular, this ebook will **not** use webpack, react, babel, gulp, grunt,
TypeScript, CoffeeScript, AngularJS, Dart, or any other build system,
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

```javascript
const koa = require('koa');
const app = koa();
app.use(function*(next) {
  const start = Date.now();
  yield next;
  console.log(Date.now() - start); // Will print approximately 1000
});
app.use(function*(next) {
  setTimeout(() => { yield next; }, 1000);
});
app.listen(3000);
```

<br><br><br>

* Transpiling generator functions into plain-old functions for ES5 environments.
You'll learn about the open-source transpiler regenerator, and write a
rudimentary transpiler using the open-source JavaScript parser esprima.

This book strives to minimize external dependencies. However, in the
interest of providing realistic examples and minimizing tangential work, this
book utilizes a handful of npm modules.

* co 4.6.0
* escodegen 1.8.0
* esprima 2.7.1
* estraverse 4.1.1
* koa 1.1.2
* koa-compose 2.3.0
* regenerator 0.8.42
* superagent 1.6.1
* thunkify 2.1.2

All this book's code examples are generated from a mocha test suite using
the acquit npm module. The tests are run using Node.js 5.4.1. However, if you
find any issues, please report them
on <br>
[github.com/vkarpov15/generators-book-issues](https://github.com/vkarpov15/generators-book-issues).

For the most part, the code samples in this book can be run as-is in Node.js
with a little massaging. However, for cases when you may struggle with running
the code samples, the raw mocha test cases that generate the
code examples for chapters 1-4 are packaged with this book as
`chapterX.test.js`.

Are you ready to become a master of ES2015 generators? Let's get started!
