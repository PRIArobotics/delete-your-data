import { json, Router } from 'express';

import accountRoutes from './account.routes';
import logRoutes from './log.routes';
import pluginRoutes from './plugin.routes';

const apiRoutes = [accountRoutes, logRoutes, pluginRoutes];

const router = Router();
// parse JSON on a request's body
router.use(json());

for (const cb of apiRoutes) {
  cb(router);
}

export default router;
