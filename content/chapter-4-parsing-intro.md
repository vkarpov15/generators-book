In order to write a transpiler, you first need to learn to use a JavaScript
parser. Esprima is one of the most well-adopted JavaScript parsers. In this
section, you'll inspect the syntax trees esprima produces for generator
functions in preparation for writing your own rudimentary transpiler.

Esprima exposes a `parse()` function that takes in some JavaScript code and
outputs a **syntax tree**. A syntax tree is a tree that represents the
structure of the code - a syntax tree makes it much easier to transform
code than if you just tried to manipulate a string.

<br>

Below is an example syntax tree for a simple generator function. In particular,
note that the generator function expression is parsed onto a node that has
a `type` property equal to "FunctionExpression" and a `generator` property
that's set to true. It also has a `body` property that contains a `body` array
property which contains a `return` statement.
