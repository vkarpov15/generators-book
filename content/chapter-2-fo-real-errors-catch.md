ES2015 promises have a handy helper function called `.catch()`. While `catch()`
may sound intimidating, it is just a convenient shorthand for `.then()` with
no `onFulfilled` handler. In other words using `.catch()` as shown below:

```javascript
promise.catch(errorHandler);
```

is just a convenient shorthand for the below code.

```javascript
promise.then(null, errorHandler);
```

Below is the previous example re-written to use `.catch()`.
