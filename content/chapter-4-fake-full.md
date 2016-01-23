<br><br><br>

There are two key points the previous example glossed over. The first point
is what happens with variable assignments? Suppose you had a generator function
that assigned to a variable.

```javascript
const generatorFunction = function*() {
  let res = yield superagent.get('http://www.google.com');
  return res.text;
};
```

The `generatorLogic()` function needs to get called multiple times, and after
each `return` the function stack gets wiped out. There's no way to persist
local variables between calls to `generatorLogic()`. Right about now you're
probably starting to miss generators. The workaround is to store variables in
an object outside of the `generatorLogic()` function.

```javascript
const variables = {};

const fakeGeneratorFunction = function(v, step) {
  if (step === 0) return superagent.get('http://www.google.com');
  if (step === 1) {
    variables['res'] = v;
    return variables['res'].text;
  }
};
```

The second and more tricky point is how to handle errors and try/catch. Remember
that generators have a `throw()` method that lets you trigger an error in the
generator function that you can try/catch. For instance:

```javascript
const generatorFunction = function*() {
  let res;
  try {
    // You'll get an error here (so the `catch` block will execute)
    // because co will call `throw()` when this `superagent.get()`
    // call fails.
    res = yield superagent.get('http://notvalid.baddomain');
  } catch(err) {
    // When the error is thrown, this will return
    return 'Failed';
  }
  return res.text;
};
```

The general idea is that your `generatorLogic()` function needs to take an
`error` parameter, and you need to have a separate case for if you're on
step 1 and `generator.throw()` was called. In other words, the catch block
above needs to be in a separate `if()` statement.

<br><br><br><br><br><br>

Below is an example of how you can handle errors in your fake generator
function.
