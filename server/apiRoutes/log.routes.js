import { Router } from 'express';

import { Log } from '../controller';

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

  const create = expressify((req) => Log.create(req.body));
  router.post('/', create);

  const readAll = expressify((req) => Log.readAll());
  router.get('/', readAll);

  const read = expressify((req) => Log.read(+req.params.id));
  router.get('/:id(\\d+)', read);

  const update = expressify((req) => Log.update(+req.params.id, req.body));
  router.put('/:id(\\d+)', update);

  const del = expressify((req) => Log.del(+req.params.id));
  router.delete('/:id(\\d+)', del);

  app.use('/log', router);
};
