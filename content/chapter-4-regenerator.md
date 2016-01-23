Regenerator is a transpiler: it takes some JavaScript code as a string, and
produces some equivalent JavaScript code as a string. When writing a transpiler,
the two key questions are:

1. What code do you want to transform?
2. What do you want to transform the code into?

In regenerator's case, the first question is simple: you want to transform
every generator function `function*() {}` and every `yield` statement within a
generator function. The second question is more subtle.

<br>

The ES2015 spec defines
a generator solely in terms of which properties it has. In other words, any
JavaScript object can be a generator, not just the return value of a generator
function. When it comes to JavaScript language APIs, the letter of the law
is vastly more important than the spirit of the law. Any JavaScript object
with a `next()` function and a `throw()` function is a generator as far as
co is concerned. For example, if you have an object with a `next()` function
that returns a promise like you see below, co will still recognize it as a
generator. Note that there are no `function*()` definitions.
