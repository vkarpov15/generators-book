Koa and koa-compose are powerful tools, but they are far from perfect. At the
time of this writing, koa 2 is in alpha release and completely breaks the
koa 1 API that you learned about in the koa section. Koa 1 also supports
the composition module as a replacement for koa-compose. What's the issue
with koa-compose? One issue with koa-compose is that it doesn't properly
support returning values from middleware. This is a minor issue, which is why koa
v2 drops support for composition and uses koa-compose.
