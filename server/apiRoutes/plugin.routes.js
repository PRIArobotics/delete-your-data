const { Router } = require('express');

const { Plugin } = require('../controller');

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

  router.post('/', expressify(req => Plugin.create(req.body)));

  router.get('/', expressify(req => Plugin.readAll(req.query)));

  router.get('/:uuid', expressify(req => Plugin.read(req.params.uuid)));

  router.put('/:uuid', expressify(req => Plugin.update(req.params.uuid, req.body)));

  router.delete('/:uuid', expressify(req => Plugin.delete(req.params.uuid)));

  app.use('/plugin', router);
};

module.exports.name = 'Plugin';
