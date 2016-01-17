Co and the notion of asynchronous coroutines enable you to write asynchronous
code with cleaner syntax. However, co is useful for more than just writing
HTTP requests without callbacks. As you saw in the "Real Implementation of Co"
section, co supports generators as an asynchronous primitive. You used this
idea to write helper functions that were also generators. The idea of yielding
generators is useful for composing asynchronous functions, which leads to the
idea of middleware.

The concept of **middleware** in JavaScript is a sequence of functions where
one function is responsible.
