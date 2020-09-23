import { json, Router } from 'express';

import { Plugin, Account, Log } from './controller';

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

export default (pluginRegistry) => {
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

  // plugin routes
  router.postAsync('/plugin/', (req) => Plugin.create(req.body));
  router.getAsync('/plugin/', (req) => Plugin.readAll(req.query));
  router.getAsync('/plugin/:uuid', (req) => Plugin.read(req.params.uuid));
  router.putAsync('/plugin/:uuid', (req) => Plugin.update(req.params.uuid, req.body));
  router.deleteAsync('/plugin/', (req) => Plugin.delMany(req.body));
  router.deleteAsync('/plugin/:uuid', (req) => Plugin.del(req.params.uuid));

  // account routes
  router.postAsync('/account/', (req) => Account.create(req.body));
  router.getAsync('/account/', (req) => Account.readAll(req.query));
  router.getAsync('/account/:uuid', (req) => Account.read(req.params.uuid));
  router.putAsync('/account/:uuid', (req) => Account.update(req.params.uuid, req.body));
  router.deleteAsync('/account/', (req) => Account.delMany(req.body));
  router.deleteAsync('/account/:uuid', (req) => Account.del(req.params.uuid));

  // log routes
  async function convertDatesInQuery(req) {
    if ('earliest' in req.query) req.query.earliest = new Date(+req.query.earliest);
    if ('latest' in req.query) req.query.latest = new Date(+req.query.latest);
  }

  router.postAsync('/log/', (req) => Log.create(req.body));
  router.getAsync('/log/', convertDatesInQuery, (req) => Log.readAll(req.query));
  router.getAsync('/log/:id(\\d+)', (req) => Log.read(req.params.id));
  router.putAsync('/log/:id(\\d+)', (req) => Log.update(req.params.id, req.body));
  router.deleteAsync('/log/', (req) => Log.delMany(req.body));
  router.deleteAsync('/log/:id(\\d+)', (req) => Log.del(req.params.id));

  // additional routes
  router.getAsync('/account/:uuid/log', convertDatesInQuery, (req) =>
    Log.readAll({ ...req.query, accountUuid: req.params.uuid }),
  );
  router.getAsync('/person/:uuid/account', (req) =>
    Account.readAll({ ...req.query, personUuid: req.params.uuid }),
  );
  router.getAsync('/person/:uuid/log', convertDatesInQuery, (req) =>
    Log.readAll({ ...req.query, personUuid: req.params.uuid }),
  );

  // logic routes
  router.postAsync('/account/redact', (req) => Account.redact(pluginRegistry, req.body));

  return router;
};
