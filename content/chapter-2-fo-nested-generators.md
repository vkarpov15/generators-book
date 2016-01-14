Another limitation is the ability to use helper functions that yield. For
instance, suppose you wanted to write a `retry()` helper function that
retried an asynchronous operation a fixed number of times for you.
You might try implementing retry as a plain old function
(as opposed to a generator function) and then quickly realize that you can't
yield from a normal function. You might then try implementing
the `retry()` function as shown below. But alas! Your `fo()` v1 doesn't
supporting yielding generators! 
