const { Router } = require('express');

const { Index } = require('../controller');

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

  router.post('/', expressify(req => Index.create(req.body)));

  router.get('/', expressify(req => Index.readAll(req.query)));

  router.get('/:id', expressify(req => Index.read(req.params.id)));

  router.get('/:user_id', expressify(req => Index.readByUserID(req.params.user_id)));

  router.put('/:id', expressify(req => Index.update(req.params.id, req.body)));

  router.delete('/:id', expressify(req => Index.delete(req.params.id)));

  app.use('/index', router);
};

module.exports.name = 'Index';
