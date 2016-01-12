One detail that has been glossed over so far is how generators handle
exceptions. What happens when you divide by zero in a generator? As you
might have guessed, the `generator.next()` call throws an error.
