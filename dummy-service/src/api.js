import { json, Router } from 'express';

import { Account, Entry } from './controller';

/**
 * Converts an async function into an express-conformant request handler.
 * This function responds in the following way to the handler's result:
 * - Handler returns normally/promise resolves:
 *   - The return value is `undefined`:
 *     the next middleware is invoked.
 *   - The return value is `null`:
 *     no more middleware is invoked. It's the handler's responsibility to finish the request.
 *   - Anything else is returned:
 *     that value is sent as the response.
 * - Handler throws an exception/promise rejects:
 *   the error is passed to express' `next`, triggering any error handling middleware.
 */
function expressify(asyncHandler) {
  return (req, res, next) => {
    asyncHandler(req, res)
      .then((data) => {
        if (data === undefined) next();
        else if (data !== null) res.send(data);
      })
      .catch(next);
  };
}

/**
 * Returns a function that behaves like the `Router.get` etc. methods,
 * except that all callbacks passed are wrapped in `expressify` before being invoked.
 * The `method` will be bound to the router instance the returned function is invoked against,
 * i.e. in
 *
 *    const router = Router();
 *    router.get = wrapAsync(Router.get);
 *    Router.put = wrapAsync(Router.put);
 *    const post = wrapAsync(router.post);
 *
 * `get` is replaced on the single router instance and `put` on all instances of Router.
 * `post` would not be functional on its own, because calling it would leave `this` undefined.
 *
 * There is no need to replace an existing method, a new name can be chosen as well.
 */
function wrapAsync(method) {
  return function(path, ...callbacks) {
    method.call(this, path, ...callbacks.map(expressify));
  };
}

export default (dydConfig) => {
  const router = Router();
  // parse JSON on a request's body
  router.use(json());
  // add wrappers for async handlers
  router.deleteAsync = wrapAsync(Router.delete);
  router.getAsync = wrapAsync(Router.get);
  router.postAsync = wrapAsync(Router.post);
  router.putAsync = wrapAsync(Router.put);

  // convert all `:id` params to integers
  router.param('id', (req, res, next) => {
    req.params.id = +req.params.id;
    next();
  });

  // account routes
  router.postAsync('/account/', (req) => Account.create(dydConfig, req.body));
  router.getAsync('/account/', (req) => Account.readAll());
  router.getAsync('/account/:username', (req) => Account.read(req.params.username));
  router.deleteAsync('/account/:username', (req) => Account.del(req.params.username));

  // entry routes
  router.postAsync('/entry/', (req) => Entry.create(dydConfig, req.body));
  router.getAsync('/entry/', (req) => Entry.readAll(req.query));
  router.getAsync('/entry/:id(\\d+)', (req) => Entry.read(req.params.id));
  router.putAsync('/entry/:id(\\d+)', (req) => Entry.update(req.params.id, req.body));
  router.deleteAsync('/entry/:id(\\d+)', (req) => Entry.del(req.params.id));

  return router;
};
