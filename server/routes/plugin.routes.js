const controller = require('../controller');
module.exports.doRouting = app => {
  var router = require('express').Router();

  router.post('/', controller.Plugin.create);

  router.get('/', controller.Plugin.readAll);

  router.get('/:id', controller.Plugin.read);

  router.put('/:id', controller.Plugin.update);

  router.delete('/:id', controller.Plugin.delete);

  router.delete('/', controller.Plugin.deleteAll);

  app.use('/api/plugin', router);
};

module.exports.name = 'Plugin';
