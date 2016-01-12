For/Of loops aren't just for generators. A generator is actually an instance
of a more general ES2015 concept called an iterator. An **iterator** is
any JavaScript object that has a `next()` function that returns
`{ value: Any, done: Boolean }`. A generator is one example of an iterator.
You can also iterate over arrays:

```javascript
for (const x of [1, 2, 3]) {
  x; // 1, 2, 3
}
```

However, For/Of loops don't operate on iterators, they operate on iterables.
An **iterable** is an object that has a `Symbol.iterator` property which is
a function that returns an iterator. In other words, when you execute a
For/Of loop, the JavaScript interpreter looks for a `Symbol.iterator` property
on the object you're looping `of`.
