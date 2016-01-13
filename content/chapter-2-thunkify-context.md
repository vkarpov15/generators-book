If thunkify makes thunks so easy, why do you ever need anything else? As is
often the case with JavaScript, the problem is the `this` keyword.
The below example shows that when you call `thunkify()` on a function, that
function loses its value of `this`.
