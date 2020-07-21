const { Router } = require('express');

const { Index } = require('../controller');

module.exports.doRouting = app => {
  var router = Router();

  router.post('/', Index.create);

  router.get('/', Index.readAll);

  router.get('/:id', Index.read);

  router.put('/:id', Index.update);

  router.delete('/:id', Index.delete);

  router.delete('/', Index.deleteAll);

  app.use('/index', router);
};

module.exports.name = 'Index';
