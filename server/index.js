import { appPromise, host, port } from './app';

appPromise.then((app) => {
  app.listen(port, host);
  consola.success({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
});
