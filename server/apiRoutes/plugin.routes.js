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

  router.get('/:uuid', expressify(req => Plugin.read(req.params.uuid)));

  router.put('/:uuid', expressify(req => Plugin.update(req.params.uuid, req.body)));

  router.delete('/:uuid', expressify(req => Plugin.delete(req.params.uuid)));

  router.delete('/', expressify(req => Plugin.deleteAll()));

  app.use('/plugin', router);
};

module.exports.name = 'Plugin';
