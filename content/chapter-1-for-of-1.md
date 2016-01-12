Remember the for loop you saw for exhausting the Fibonacci generator?

```javascript
for (it = fibonacci.next(); !it.done; it = fibonacci.next()) {}
```

This for loop is a perfectly reasonable way of going through every value of
the generator. However, ES2015 introduces a much cleaner mechanism for
looping through generators: the `for-of` loop.
