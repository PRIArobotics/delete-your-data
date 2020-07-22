const { Router } = require('express');

const { Plugin } = require('../controller');

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

  router.get('/:id', Plugin.read);

  router.put('/:id', Plugin.update);

  router.delete('/:id', Plugin.delete);

  router.delete('/', Plugin.deleteAll);

  app.use('/plugin', router);
};

module.exports.name = 'Plugin';
