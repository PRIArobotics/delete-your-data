import consola from 'consola';

import createApp, { host, port } from './app';

createApp().then((app) => {
  app.listen(port, host);
  consola.success({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
});
