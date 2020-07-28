import { Router } from 'express';

import { User } from '../controller';

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

export function doRouting(app) {
  var router = Router();

  const create = expressify((req) => User.create(req.body));
  router.post('/', create);

  const readAll = expressify((req) => User.readAll());
  router.get('/', readAll);

  const read = expressify((req) => User.read(+req.params.id));
  router.get('/:id', read);

  const readByUuid = expressify((req) => User.readByUuid(req.params.uuid, req.params.plugin_uuid));
  router.get('/:uuid/:plugin_uuid', readByUuid);

  const update = expressify((req) => User.update(+req.params.id, req.body));
  router.put('/:id', update);

  const updateByUuid = expressify((req) =>
    User.updateByUuid(req.params.uuid, req.params.plugin_uuid, req.body),
  );
  router.put('/:uuid/:plugin_uuid', updateByUuid);

  const del = expressify((req) => User.del(+req.params.id));
  router.delete('/:id', del);

  const delByUuid = expressify((req) => User.delByUuid(req.params.uuid, req.params.plugin_uuid));
  router.delete('/:uuid/:plugin_uuid', delByUuid);

  app.use('/user', router);
}

module.exports.name = 'User';
