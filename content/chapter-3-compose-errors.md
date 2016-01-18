<br><br>

The real implementation of koa-compose is almost identical to the above
implementation, just with better support for the `this` keyword. The `this`
keyword will be important in the koa section. But, before you learn about koa,
let's take a look at how error handling works in koa-compose.

Remember that koa-compose doesn't add any special error handling on top of
co and generators. If the first middleware in the chain throws an error,
the subsequent middleware functions never execute, and the `yield` statement
that calls the composed function will throw an error.
