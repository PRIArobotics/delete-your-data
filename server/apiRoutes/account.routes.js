import { Router } from 'express';

import { Account } from '../controller';

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

  const create = expressify((req) => Account.create(req.body));
  router.post('/', create);

  const readAll = expressify((req) => Account.readAll());
  router.get('/', readAll);

  const read = expressify((req) => Account.read(req.params.uuid));
  router.get('/:uuid', read);

  // const readAllByUuid = expressify((req) => Account.readAllByUuid(req.params.personUuid));
  // router.get('/:personUuid', readAllByUuid);

  // const readByUuid = expressify((req) => Account.readByUuid(req.params.personUuid, req.params.pluginUuid));
  // router.get('/:personUuid/:pluginUuid', readByUuid);

  const update = expressify((req) => Account.update(req.params.uuid, req.body));
  router.put('/:uuid', update);

  // const updateByUuid = expressify((req) =>
  //   Account.updateByUuid(req.params.personUuid, req.params.pluginUuid, req.body),
  // );
  // router.put('/:personUuid/:pluginUuid', updateByUuid);

  const del = expressify((req) => Account.del(req.params.uuid));
  router.delete('/:uuid', del);

  // const delByUuid = expressify((req) => Account.delByUuid(req.params.personUuid, req.params.pluginUuid));
  // router.delete('/:personUuid/:pluginUuid', delByUuid);

  app.use('/account', router);
}

module.exports.name = 'Account';
