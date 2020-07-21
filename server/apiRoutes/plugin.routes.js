const { Router } = require('express');

const { Plugin } = require('../controller');

module.exports.doRouting = app => {
  var router = Router();

  router.post('/', Plugin.create);

  router.get('/', Plugin.readAll);

  router.get('/:id', Plugin.read);

  router.put('/:id', Plugin.update);

  router.delete('/:id', Plugin.delete);

  router.delete('/', Plugin.deleteAll);

  app.use('/plugin', router);
};

module.exports.name = 'Plugin';
