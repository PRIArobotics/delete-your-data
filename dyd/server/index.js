import consola from 'consola';

import { pluginRegistry } from '../plugins/dydPluginRegistry.js';
import createApp, { host, port } from './app';

createApp(pluginRegistry).then((app) => {
  app.listen(port, host);
  consola.success({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
});
