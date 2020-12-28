import { json, Router } from 'express';

import { Plugin, Account, Log, Token, Access } from './controller';

import { requireAccess } from './auth';

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
  router.patchAsync = wrapAsync(Router.patch);

  async function convertDatesInQuery(req) {
    if ('earliest' in req.query) req.query.earliest = new Date(+req.query.earliest);
    if ('latest' in req.query) req.query.latest = new Date(+req.query.latest);
  }

  {
    const adminRouter = Router();
    // add wrappers for async handlers
    adminRouter.deleteAsync = wrapAsync(Router.delete);
    adminRouter.getAsync = wrapAsync(Router.get);
    adminRouter.postAsync = wrapAsync(Router.post);
    adminRouter.putAsync = wrapAsync(Router.put);
    adminRouter.patchAsync = wrapAsync(Router.patch);

    // check admin access
    adminRouter.use((req, _res, next) => {
      // TODO implement admins & admin access
      // requireAccess(req, 'admin');
      next();
    });

    // convert all `:id` params to integers
    adminRouter.param('id', (req, _res, next) => {
      req.params.id = +req.params.id;
      next();
    });

    // plugin routes
    adminRouter.postAsync('/plugin/', (req) => Plugin.create(req.body));
    adminRouter.getAsync('/plugin/', (req) => Plugin.readAll(req.query));
    adminRouter.getAsync('/plugin/:uuid', (req) => Plugin.read(req.params.uuid));
    adminRouter.putAsync('/plugin/:uuid', (req) => Plugin.update(req.params.uuid, req.body));
    adminRouter.deleteAsync('/plugin/', (req) => Plugin.delMany(req.body));
    adminRouter.deleteAsync('/plugin/:uuid', (req) => Plugin.del(req.params.uuid));

    // account routes
    adminRouter.postAsync('/account/', (req) => Account.create(req.body));
    adminRouter.getAsync('/account/', (req) => Account.readAll(req.query));
    adminRouter.getAsync('/account/:uuid', (req) => Account.read(req.params.uuid));
    adminRouter.putAsync('/account/:uuid', (req) => Account.update(req.params.uuid, req.body));
    adminRouter.deleteAsync('/account/', (req) => Account.delMany(req.body));
    adminRouter.deleteAsync('/account/:uuid', (req) => Account.del(req.params.uuid));

    // log routes
    adminRouter.postAsync('/log/', (req) => Log.create(req.body));
    adminRouter.getAsync('/log/', convertDatesInQuery, (req) => Log.readAll(req.query));
    adminRouter.getAsync('/log/:id(\\d+)', (req) => Log.read(req.params.id));
    adminRouter.putAsync('/log/:id(\\d+)', (req) => Log.update(req.params.id, req.body));
    adminRouter.deleteAsync('/log/', (req) => Log.delMany(req.body));
    adminRouter.deleteAsync('/log/:id(\\d+)', (req) => Log.del(req.params.id));

    // token routes
    adminRouter.postAsync('/token/', (req) => Token.create(req.body));
    adminRouter.getAsync('/token/', (req) => Token.readAll(req.query));
    adminRouter.getAsync('/token/:uuid', (req) => Token.read(req.params.uuid));
    adminRouter.deleteAsync('/token/', (req) => Token.delMany(req.body));
    adminRouter.deleteAsync('/token/:uuid', (req) => Token.del(req.params.uuid));

    // access routes
    adminRouter.postAsync('/access/', (req) => Access.create(req.body));
    adminRouter.getAsync('/access/', (req) => Access.readAll(req.query));
    adminRouter.getAsync('/access/:tokenString', (req) => Access.read(req.params.tokenString));
    adminRouter.deleteAsync('/access/:tokenString', (req) => Access.del(req.params.tokenString));

    // additional routes
    adminRouter.getAsync('/account/:uuid/log', convertDatesInQuery, (req) =>
      Log.readAll({ ...req.query, accountUuid: req.params.uuid }),
    );
    adminRouter.getAsync('/person/:uuid/account', (req) =>
      Account.readAll({ ...req.query, personUuid: req.params.uuid }),
    );
    adminRouter.getAsync('/person/:uuid/log', convertDatesInQuery, (req) =>
      Log.readAll({ ...req.query, personUuid: req.params.uuid }),
    );

    // logic routes
    adminRouter.postAsync('/account/redact', (req) => Account.redact(pluginRegistry, req.body));
    adminRouter.postAsync('/person/redact', (req) => Account.redactPersons(pluginRegistry, req.body));
    adminRouter.postAsync('/log/redact', (req) => Log.redact(pluginRegistry, req.body));

    router.use(adminRouter);
  }

  {
    const pluginRouter = Router();
    // add wrappers for async handlers
    pluginRouter.deleteAsync = wrapAsync(Router.delete);
    pluginRouter.getAsync = wrapAsync(Router.get);
    pluginRouter.postAsync = wrapAsync(Router.post);
    pluginRouter.putAsync = wrapAsync(Router.put);
    pluginRouter.patchAsync = wrapAsync(Router.patch);

    // check plugin access
    // TODO statically ensure that all routes have a :pluginUuid param
    // to ensure authorization is checked
    pluginRouter.param('pluginUuid', (req, _res, next) => {
      requireAccess(req, req.params.pluginUuid);
      next();
    });

    // convert all `:nativeId` params to JS objects
    pluginRouter.param('nativeId', (req, _res, next) => {
      req.params.nativeId = JSON.parse(req.params.nativeId);
      next();
    });

    // convert all `:nativeLocation` params to JS objects
    pluginRouter.param('nativeLocation', (req, _res, next) => {
      req.params.nativeLocation = JSON.parse(req.params.nativeLocation);
      next();
    });

    // per-plugin account routes
    pluginRouter.postAsync('/plugin/:pluginUuid/account/', (req) =>
      Account.create({ ...req.params, ...req.body }),
    );
    pluginRouter.getAsync('/plugin/:pluginUuid/account/', (req) =>
      Account.readAll({ ...req.params, ...req.query }),
    );
    pluginRouter.getAsync('/plugin/:pluginUuid/account/:nativeId', (req) =>
      Account.readByNativeId(req.params),
    );
    pluginRouter.patchAsync('/plugin/:pluginUuid/account/:nativeId', (req) =>
      Account.updateByNativeId(req.params, req.body),
    );
    pluginRouter.deleteAsync('/plugin/:pluginUuid/account/:nativeId', (req) =>
      Account.delByNativeId(req.params),
    );

    // per-plugin log routes
    pluginRouter.postAsync('/plugin/:pluginUuid/log/', (req) =>
      // TODO check the account belongs to the plugin given by :pluginUuid
      Log.create({ ...req.params, ...req.body }),
    );
    pluginRouter.getAsync('/plugin/:pluginUuid/log/', convertDatesInQuery, (req) =>
      // TODO limit results to accounts belonging ot the plugin given by :pluginUuid
      Log.readAll({ ...req.params, ...req.query }),
    );
    pluginRouter.getAsync('/plugin/:pluginUuid/log/:nativeLocation', (req) =>
      Log.readByNativeLocation(req.params),
    );
    pluginRouter.patchAsync('/plugin/:pluginUuid/log/:nativeLocation', (req) =>
      Log.updateByNativeLocation(req.params, req.body),
    );
    pluginRouter.deleteAsync('/plugin/:pluginUuid/log/:nativeLocation', (req) =>
      Log.delByNativeLocation(req.params),
    );

    router.use(pluginRouter);
  }

  return router;
};
