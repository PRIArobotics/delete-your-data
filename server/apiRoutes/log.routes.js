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
      .then(data => res.send(data))
      .catch(next);
  };
}

module.exports.doRouting = app => {
  var router = Router();

  router.post('/', expressify(req => Log.create(req.body)));

  router.get('/', expressify(req => Log.readAll(req.query)));

  router.get('/:id', expressify(req => Log.read(req.params.id)));

  router.get('/:user_id', expressify(req => Log.readByUserID(req.params.user_id)));

  router.put('/:id', expressify(req => Log.update(req.params.id, req.body)));

  router.delete('/:id', expressify(req => Log.delete(req.params.id)));

  app.use('/log', router);
};

module.exports.name = 'Log';
