import consola from 'consola';

import createApp, { host, port } from './app';

createApp({
  dydEndpoint: 'http://localhost:3000/api',
  dydPluginUuid: 'TODO',
}).then((app) => {
  app.listen(port, host);
  consola.success({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
});
