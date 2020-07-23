const { Router } = require('express');

const { User } = require('../controller');

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

  router.post('/', expressify(req => User.create(req.body)));

  router.get('/', expressify(req => User.readAll(req.query)));

  router.get('/:id', expressify(req => User.read(req.params.id)));

  router.get('/:uuid', expressify(req => User.readByUuid(req.params.uuid)));

  router.get('/:uuid/:plugin_uuid', expressify(req => User.readByUuid(req.params.uuid)));

  router.put('/:id', expressify(req => User.update(req.params.id, req.body)));

  router.delete('/:uuid', expressify(req => User.delete(req.params.uuid)));

  app.use('/user', router);
};

module.exports.name = 'User';
