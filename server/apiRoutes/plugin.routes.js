import { Router } from 'express';

import { Plugin } from '../controller';

// Converts an async function into an express-conformant request handler
// If the function is successful (Promise resolves),
// the function's return value is sent as an http response.
// If the function is unsuccessful (exception thrown/Promise rejected),
// that error is passed to express' `next`, triggering any error handling middleware.
function expressify(asyncHandler) {
  return (req, res, next) => {
    asyncHandler(req)
      .then((data) => res.send(data))
      .catch(next);
  };
}

export default (app) => {
  var router = Router();

  const create = expressify((req) => Plugin.create(req.body));
  router.post('/', create);

  const readAll = expressify((req) => Plugin.readAll(req.query));
  router.get('/', readAll);

  const read = expressify((req) => Plugin.read(req.params.uuid));
  router.get('/:uuid', read);

  const update = expressify((req) => Plugin.update(req.params.uuid, req.body));
  router.put('/:uuid', update);

  const del = expressify((req) => Plugin.del(req.params.uuid));
  router.delete('/:uuid', del);

  app.use('/plugin', router);
};
