const consola = require('consola');
const fs = require('fs');
const path = require('path');
const { Router } = require('express');

const router = Router();

consola.info({
  message: 'Finding all Routes and Controller:',
  badge: true,
});

fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.routes.js'))
  .forEach(file => {
    const route = require(path.join(__dirname, file));
    route.doRouting(router);
    consola.info('Routes found: ' + route.name);
  });

module.exports = router;

consola.log('- - - - - - - - -');
consola.success('server/routes/index.js');
consola.log('-----------------------------------');
