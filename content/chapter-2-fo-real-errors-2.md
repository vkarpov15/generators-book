<br><br><br><br><br><br>

Fo's error handling abilities aren't limited to asynchronous errors. Since you
wrapped `generator.next()` in a try/catch, fo reports **any** uncaught errors
that occur when executing the generator to your `onRejected` handler. For
instance, say you accidentally access a nonexistent property and get the
dreaded `TypeError: Cannot read property 'X' of undefined` error. Fo will
report that error to `onRejected` as well!
