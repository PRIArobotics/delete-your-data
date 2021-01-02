import consola from 'consola';

import { pluginRegistry } from '../plugins/dydPluginRegistry.js';
import createApp, { host, port } from './app';

// istanbul ignore next: main entry point not used by unit tests
createApp(pluginRegistry).then((app) => {
  app.listen(port, host);
  consola.success({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
});
