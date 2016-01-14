<br>

This new version of fo also enables you to execute requests in parallel.
If you yield an array, fo will execute the array elements in parallel and
return the results as an array. The magic that makes this work is the
`toPromise()` function's array handler.

```javascript
// Convert v to a promise. If invalid, returns a rejected promise
function toPromise(v) {
  if (isGeneratorFunction(v) || isGenerator(v)) return fo(v);
  if (v.then) return v;
  if (typeof v === 'function') {
    return new Promise((resolve, reject) => {
      v((error, res) => error ? reject(error) : resolve(res));
    });
  }
  // Magic array handler
  if (Array.isArray(v)) return Promise.all(v.map(toPromise));
  return Promise.reject(new Error(`Invalid yield ${v}`));
}
```

The `Promise.all()` function is yet another new feature in the ES2015 spec.
The `Promise.all()` function takes an array of promises and converts them
into a single promise. The `Promise.all()` promise's `onFulfilled` function
gets called when every promise in the array is resolved, and its
`onRejected` function gets called whenever any of the promises in the array
is rejected.

When your generator function yields an array, the `toPromise()` function first
uses `.map()` to convert every element in the array to a promise, and then
passes that array to `Promise.all()`. This means that the HTTP requests below
execute in parallel.
