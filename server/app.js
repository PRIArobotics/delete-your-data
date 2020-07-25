import express from 'express';
import { Nuxt, Builder } from 'nuxt';
import { initSequelize } from '../models';
import apiRoutes from './apiRoutes';

// Import and Set Nuxt.js options
import config from '../nuxt.config.js';
config.dev = process.env.NODE_ENV === 'development';

// Init Nuxt.js
const nuxt = new Nuxt(config);

async function createApp() {
  const app = express();

  await nuxt.ready();

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // register API routes before nuxt middleware
  app.use('/api', apiRoutes);

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // check DB connection & synchronize models
  await initSequelize();

  return app;
}

export default createApp();

const { host, port } = nuxt.options.server;
export { host, port };
