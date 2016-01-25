<br><br>

The second step for the transpiler is to convert `yield` and `return` statements
to `return` statements that use the `generatorResult()` function. This ensures
the resulting generator's `next()` returns properly formated results. To do
this, every 'YieldExpression' and 'ReturnStatement' node needs to be
transformed to a 'ReturnStatement' that returns a call to `generatorResult()`,
as shown below.
