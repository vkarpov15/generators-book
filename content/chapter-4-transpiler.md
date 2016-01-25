Now that you've seen how the syntax tree for generator functions looks, it's
time to implement a rudimentary transpiler for generator functions using
your runtime API from the "Faking a Generator Function" section. Your
transpiler will be far from a fully fledged regenerator replacement, but it
will be able to transpile some basic generator functions.

The transpiler needs to perform 3 distinct tasks:

* Convert generator functions into calls to `GeneratorFunction()`.

```javascript
// Before
const f = function*() {};
```

```javascript
// After
const f = GeneratorFunction(function(v, step)) {}
```

* Convert `yield` and `return` expressions to returns that use
`generatorResult()`.

```javascript
// Before
yield 'Hello';
return 'World';
```

```javascript
// After
return generatorResult('Hello', false);
return generatorResult('World', true);
```

* Break the function body up into steps based on `yield` and `return`
statements.

```javascript
// Before
const variables = {};
const generatorFunction = function*() {
  variables['res'] = yield superagent.get('http://www.google.com');
  return variables['res'].text;
};
```

```javascript
// After
const generatorFunction = GeneratorFunction(function(v, step) {
  if (step === 0) {
    return generatorResult(
      superagent.get('http://www.google.com'), false);
  }
  if (step === 1) {
    // Note that we need to assign to the value passed to `next()`
    variables['res'] = v;
    return generatorResult(variables['res'], true);
  }
});
```

<br>

You're going to implement all these steps separately, because one block of
code that does all of these steps at once is too complex. The first step,
converting `function*` into a call to `GeneratorFunction()`, is the most
straightforward. You need to take each 'FunctionExpression' node that has a
`generator` flag set and convert it into a non-generator within a
'CallExpression' node as shown below.
