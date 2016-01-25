<br>

And that's it! Now you have a fully transpiled fake generator function. If you
pass `generatorFunction()` into co, it will work as expected.

```javascript
const variables = [];
const generatorFunction = GeneratorFunction(function (v, step) {
  if (step === 0) {
    return generatorResult(superagent.get('http://www.google.com'),
      false);
  }
  if (step === 1) {
    variables['res'] = v;
    return generatorResult(variables['res'], true);
  }
  return generatorResult(undefined, true);
});
```

This transpiler has numerous limitations: it doesn't support try/catch blocks,
variable declarations, if statements, or for loops. That's why you should
use regenerator instead of writing your own: writing a fully-fledged transpiler
for generators is very hard! However, in writing your own
transpiler, you got to actually apply the ES2015 spec's definition of generators
and see how they work in terms of plain-old functions.
