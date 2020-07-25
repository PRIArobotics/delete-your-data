import consola from 'consola';
import fs from 'fs';
import path from 'path';
import { json, Router } from 'express';

const router = Router();
// parse JSON on a request's body
router.use(json());

consola.info({
  message: 'Finding all Routes and Controller:',
  badge: true,
});

fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.routes.js'))
  .forEach((file) => {
    const route = require(path.join(__dirname, file));
    route.doRouting(router);
    consola.info('Routes found: ' + route.name);
  });

export default router;

consola.log('- - - - - - - - -');
consola.success('server/routes/index.js');
consola.log('-----------------------------------');
