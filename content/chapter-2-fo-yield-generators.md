The new implementation of fo also enables you to yield generators and
generator functions. Since `fo()` returns a promise, all you need to do is
detect when the generator yields another generator and use `fo()` to convert
that generator to a promise. Fo v2 uses the below functions `isGenerator()`
and `isGeneratorFunction()` to determine if the yielded value is a generator
or generator function, respectively.

Co also has similar helper functions, however, co's checks are more robust.
These functions are meant to be examples, don't use them in production!

```javascript
const isGenerator = (v) => typeof v.next === 'function';
const isGeneratorFunction =
  (v) => v.constructor && v.constructor.name === 'GeneratorFunction';
```

Now that you can check if a value is a generator or a generator function,
the `toPromise()` function can call `fo()` recursively to convert the
generator you yielded into a promise.

```javascript
// Convert v to a promise. If invalid, returns a rejected promise
function toPromise(v) {
  if (isGeneratorFunction(v) || isGenerator(v)) return fo(v);
}
```

And now, you can write helper functions that can yield, as long as the helper
function is a generator function too.
