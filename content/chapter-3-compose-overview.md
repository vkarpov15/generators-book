The koa-compose module that you saw in this chapter's introduction is trivial
to implement. The key idea is that the `next` generator function that each
middleware gets is a generator which, when completed, means that each
subsequent middleware has completed. In other words, the `next` parameter
to each generator function needs to be a generator derived from the next
generator function in the sequence as shown below.
