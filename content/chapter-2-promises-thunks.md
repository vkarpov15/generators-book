The purpose of this chapter is to build your own co. But first, there's one
key term that we need to clarify: what sort of asynchronous operations can
you yield to co? The examples you've seen so far

<br><br><br>

in this book have been
cherry-picked. For instance, recall the asynchronous function from the
asynchronous errors section.

```javascript
const async = function(callback) {
  setTimeout(() => callback(new Error('Oops!')), 10);
};
```

The above function is asynchronous, but not representative of asynchronous
functions as a whole. For instance, the `superagent.get` function takes
a parameter as well as a callback:

```javascript
superagent.get('http://google.com', function(error, res) {
// Handle error, use res
});
```

The `async` function is an example of a thunk. A **thunk** is an asynchronous
function that takes a single parameter, a callback. The `superagent.get()`
function is _not_ a thunk, because it takes 2 parameters, a url and a callback.

Thunks may seem limited, but with arrow functions you can easily convert
any asynchronous function call to a thunk.

```javascript
co(function*() {
  yield (callback) => { superagent.get('http://google.com', callback); };
});
```

There are also libraries that can convert asynchronous functions to thunks
for you. The original author of co, TJ Holowaychuk, also wrote a library called
thunkify. As the name suggests, thunkify converts a general asynchronous
function into a thunk for use with co. The `thunkify` function takes a
single parameter, an asynchronous function, and returns a function that
returns a thunk. Below is how you would use
`thunkify()` with co.
