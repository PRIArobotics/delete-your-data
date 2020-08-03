import { json, Router } from 'express';

import { Plugin, Account, Log } from '../controller';

/**
 * Converts an async function into an express-conformant request handler.
 * If the function is successful (Promise resolves),
 * the function's return value is sent as an http response.
 * If the function is unsuccessful (exception thrown/Promise rejected),
 * that error is passed to express' `next`, triggering any error handling middleware.
 */
function expressify(asyncHandler) {
  return (req, res, next) => {
    asyncHandler(req)
      .then((data) => res.send(data))
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

const router = Router();
// parse JSON on a request's body
router.use(json());
// add wrappers for async handlers
router.deleteAsync = wrapAsync(Router.delete);
router.getAsync = wrapAsync(Router.get);
router.postAsync = wrapAsync(Router.post);
router.putAsync = wrapAsync(Router.put);

// plugin routes
router.postAsync('/plugin/', (req) => Plugin.create(req.body));
router.getAsync('/plugin/', (req) => Plugin.readAll(req.query));
router.getAsync('/plugin/:uuid', (req) => Plugin.read(req.params.uuid));
router.putAsync('/plugin/:uuid', (req) => Plugin.update(req.params.uuid, req.body));
router.deleteAsync('/plugin/:uuid', (req) => Plugin.del(req.params.uuid));

// account routes
router.postAsync('/account/', (req) => Account.create(req.body));
router.getAsync('/account/', (req) => Account.readAll(req.query));
router.getAsync('/account/:uuid', (req) => Account.read(req.params.uuid));
router.putAsync('/account/:uuid', (req) => Account.update(req.params.uuid, req.body));
router.deleteAsync('/account/:uuid', (req) => Account.del(req.params.uuid));

// log routes
router.postAsync('/log/', (req) => Log.create(req.body));
router.getAsync('/log/', (req) => Log.readAll(req.query));
router.getAsync('/log/:id(\\d+)', (req) => Log.read(+req.params.id));
router.putAsync('/log/:id(\\d+)', (req) => Log.update(+req.params.id, req.body));
router.deleteAsync('/log/:id(\\d+)', (req) => Log.del(+req.params.id));

export default router;
