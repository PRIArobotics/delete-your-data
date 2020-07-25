import consola from 'consola';
import fs from 'fs';
import path from 'path';

fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.controller.js'))
  .forEach((file) => {
    const controller = require(path.join(__dirname, file));
    consola.info('Controller loaded: ' + controller.name);
    module.exports[controller.name] = controller;
  });

consola.log('- - - - - - - - -');
consola.success('server/controller/index.js');
consola.log('-----------------------------------');
