<br>

The third and final step is the most complex. This step has 2 primary
objectives. First, you need to break up the code into steps: all the code
between `return` statements needs to be wrapped in an `if` statement that
checks the current `step`. To do this, you'll add a 2d array `_steps` to every
generator function node. You'll add each top-level expression to the last
element of the `_steps` array, and add a new empty array to the `_steps` array
every time you see a return statement.

Secondly, you need to transform any assignments that have a `yield` statement
as the right-hand side. To do this, you'll add a new 'AssignmentExpression' to
the start of the next step that assigns to the parameter `v`, which is the
value passed to `generator.next()`.
