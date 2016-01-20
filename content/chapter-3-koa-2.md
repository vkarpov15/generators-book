The goal of this section is to write your own minimal take on koa. Koa is just
a thin layer on top of koa-compose with some HTTP-specific syntactic sugar.
Recall that koa-compose retains the same `this` across all middleware functions.
In order to craft a response to an incoming HTTP request, koa requires you to
set properties on `this`, also known as the koa **context**.
