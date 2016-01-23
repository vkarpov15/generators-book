The first key idea for writing generator functions in ES5 is that a generator
can be thought of as a series of functions calls that return values. The
difference between `yield` and `return` is that you can't resume a function after
`return` has been called. Thus, in order to build a generator function out of
normal functions, you need multiple function calls.

Regenerator handles this by creating a function that gets a parameter which
defines which "step" the generator is on. A step ends with a `return` statement, or a `yield` statement, which is transformed into a `return`. You can think
of a generator as being on the x-th step if there have been x yield statements
thus far.

<br>

Let's take a look at an example. Suppose you have the below generator function.

```javascript
const generatorFunction = function*() {
  return (yield superagent.get('http://www.google.com')).text;
};
```

The above generator function has 2 steps:

1. `superagent.get('http://www.google.com')`
2. `return` the `text` property from the value that `generator.next()` gives you.

In the below function, the `generatorLogic()` function executes these two steps.
