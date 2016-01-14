One neat pattern that illustrates the power of asynchronous coroutines is
retrying failed HTTP requests. If the server you're trying to reach is
unreliable, you may want to retry requests a fixed number of times before
giving up. Without generators, retrying requests involves a lot of recursion
and careful design decisions.
With generators and `fo()` (or co), all you need to retry requests
is a for loop as shown below.
