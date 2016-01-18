One neat feature of this middleware paradigm is that you can define error
handling middleware using try/catch. Since the way you defer control to the
next generator function in the sequence is by yielding on a generator,
surrounding the `yield next` call in a try/catch will catch **any** errors
that the subsequent functions in the sequence throw.
