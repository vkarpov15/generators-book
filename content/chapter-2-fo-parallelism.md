<br><br><br><br>

Finally, fo v1 doesn't allow any parallelism. Asynchronous operations must
be executed one after the other, there's no way to execute 2 requests in
parallel. Suppose you wanted to load Google and Amazon's home pages in parallel
as shown below. As you'll see in the "Real Implementation of Co" section,
co gives you a convenient mechanism to execute requests in
parallel.
