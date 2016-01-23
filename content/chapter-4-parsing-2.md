Syntax trees can be confusing at first, but the key idea in this example is
what generator functions look like in the syntax tree.

<br><br>

Let's take a look at a simple problem: count the number of generator functions
in a piece of code. You'd need to visit each node in the
tree and check if it has a `type` property equal to 'FunctionExpression' and
a `generator` property equal to 'true'. The hard part is how to visit each
node in the tree. To make that easier, you'll use the estraverse module. This
module lets you execute two functions for each node in the tree, an `enter()`
function that executes before the traversal visits any child nodes, and
a `leave()` function that executes after the traversal visits all child nodes.
