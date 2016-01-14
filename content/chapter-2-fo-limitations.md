The v1 implementation of fo is simple, clean, and gets you 80% of the way
to writing your own co. However, co has several subtle features that become
indispensable when you try to write a real application.

One particular edge case that we glossed over in the "Write Your Own Co"
section is what happens when there's an uncaught error in the generator.
In the v1 implementation of fo, the uncaught error will crash the process.
Crashing the process isn't the worst possible behavior, but, as you'll see in
the "Real Implementation of Co" section, co provides a neat way to catch
any uncaught errors in the generator function.
