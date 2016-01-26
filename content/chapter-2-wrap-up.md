Congratulations, you've successfully implemented your own co knockoff!
Co supports all the features of fo, plus a few extra. Go take a look at
the source code for co 4.x on GitHub, it should now look familiar. Don't
forget the following key points for working with co.

* Error handling. Make sure to use `co().catch()`, this will enable you to
catch all errors that occur in your generator function, not just promise
rejections.
* Parallelism. Running requests in parallel with co is as simple as yielding
an array. Using parallel requests where possible can give you a big performance
boost.
* Internal error handling. If you don't want an error to stop execution of your
generator function, use try/catch. With co, you can use try/catch to handle
asynchronous errors.
* Helper functions. Helper functions can be generator functions as well, just
be sure to use yield.

<br><br><br><br>

Below is an example of some of the above points in action.
