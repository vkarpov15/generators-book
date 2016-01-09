The most important detail from the above example is that, when `yield`
executes, the generator function stops executing until the next time you call
`generator.next()`. You can call `generator.next()` whenever you want, even in
a `setTimeout()`. The JavaScript interpreter will re-enter the generator
function with the same state that it left off with.

<br>
<br>
