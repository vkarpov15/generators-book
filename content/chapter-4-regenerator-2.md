The general idea of regenerator is simple: convert a generator function into
a regular function that returns an object that fulfills the ES2015 generator
API. Of course, the fake generator needs to return the correct values for
`next()`: every `yield` statement needs to cause a `next()` function call
to return. The above example is not sophisticated, it only allows you to
return a single value. You'll learn about how you can replace yield statements
with ES5 code in the "Faking a Generator Function" section.

<br><br><br><br><br><br>

Below is an example of using regenerator output with co. Note that,
even though it isn't defined using `function*`, co still accepts the
`generatorFunction` as a valid generator function. Like the fake version
of co you saw in the "Asynchronous Coroutines" chapter, co defines a generator
function as any object whose `constructor.name` property is equal to
'Generator Function'. Regenerator is smart enough to change this property for
you.
