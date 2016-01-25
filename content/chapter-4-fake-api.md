In this section, your transpiler will **not** account for try/catch blocks
and variable assignments. Implementing these details would make the transpiler
too complex to serve as an digestible example. However, the previous examples
sketch the general idea of how you would implement variable assignments and
try/catch blocks.

There's one more detail to account for: defining an API for the generator
runtime that your transpiled generator functions will use. Your transpiler
will convert generator function code like what you see below:

```javascript
const generatorFunction = function*() {
  yield superagent.get('http://www.google.com');
};
```

<br>

The converted ES5 code will look like what you see below.

```javascript
const generatorFunction = GeneratorFunction(function(v, step) {
  if (step === 0) return generatorResult(
    superagent.get('http://www.google.com'), false);
  return generatorResult(undefined, true);
});
```

The above code uses 2 functions, `GeneratorFunction()` and `generatorResult()`.
These functions are the API for your generator runtime. Don't worry, they're
only cosmetically different from the logic in `fakeGeneratorFunction()` in
previous examples.
