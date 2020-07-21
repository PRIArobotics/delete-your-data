const { Router } = require('express');

const { User } = require('../controller');

module.exports.doRouting = app => {
  var router = Router();

  router.post('/', User.create);

  router.get('/', User.readAll);

  router.get('/:id', User.read);

  router.put('/:id', User.update);

  router.delete('/:id', User.delete);

  router.delete('/', User.deleteAll);

  app.use('/user', router);
};

module.exports.name = 'User';
