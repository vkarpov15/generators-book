**Symbols** are another new feature in ES2015. Since this book is about
generators, we won't explore symbols in depth, just enough to understand
what the mysterious `iterable[Symbol.iterator]` code in the previous example
is about.

<br><br><br>

You can think of a symbol as a unique identifier for a key on an object.
For instance, suppose you wrote your own programming language and defined
an iterable as an object that had a property named `iterator`. Now, every
object that has a property named `iterator` would be an iterable, which
could lead to some unpredictable behavior. For instance, suppose you added
a property named `iterator` to an array - now you've accidentally broken
for/of loops for that array!

Symbols protect you from the issue of accidental string collision. No string
key is equal to `Symbol.iterator`, so you don't have to worry about
accidentally breaking an iterable. Furthermore, symbols don't appear in
the output of `Object.keys()`.
