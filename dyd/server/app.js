import express from 'express';
import { Nuxt, Builder } from 'nuxt';
import { initSequelize } from './models';
import createApi from './api';
import DummyPlugin from 'dyd-dummy-plugin';

// Import and Set Nuxt.js options
import config from '../nuxt.config.js';
config.dev = process.env.NODE_ENV === 'development';

// Init Nuxt.js
const nuxt = new Nuxt(config);

async function createApp(pluginRegistry) {
  const app = express();

  await nuxt.ready();

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // register API routes before nuxt middleware
  app.use('/api', createApi(pluginRegistry));

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // check DB connection & synchronize models
  await initSequelize();

  return app;
}

// specify DYD plugins to use
const appPromise = createApp({
  [DummyPlugin.TYPE_NAME]: DummyPlugin,
});

export default appPromise;

const { host, port } = nuxt.options.server;
export { host, port };
