const { Router } = require('express');

const { Log } = require('../controller');

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

module.exports.doRouting = (app) => {
  var router = Router();

  const create = expressify((req) => Log.create(req.body));
  router.post('/', create);

  const readAll = expressify((req) => Log.readAll(req.query));
  router.get('/', readAll);

  const read = expressify((req) => Log.read(req.params.id));
  router.get('/:id', read);

  const readByUserID = expressify((req) => Log.readByUserID(req.params.user_id));
  router.get('/:user_id', readByUserID);

  const update = expressify((req) => Log.update(req.params.id, req.body));
  router.put('/:id', update);

  const del = expressify((req) => Log.delete(req.params.id));
  router.delete('/:id', del);

  app.use('/log', router);
};

module.exports.name = 'Log';
