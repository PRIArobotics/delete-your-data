import express from 'express';
import consola from 'consola';
import { Nuxt, Builder } from 'nuxt';
import sequelize from '../models';
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

  consola.log('-----------------------------------');
  // Listen the server
  try {
    await sequelize.authenticate();
    consola.success('sequelize.authenticate working');
  } catch (err) {
    consola.error({
      message: 'sequelize.authenticate: ' + err,
      badge: true,
    });
  }

  try {
    await sequelize.sync();
    consola.success('sequelize.sync working');
  } catch (err) {
    consola.error({
      message: 'sequelize.sync: ' + err,
      badge: true,
    });
  }

  return app;
}

export default createApp();

const { host, port } = nuxt.options.server;
export { host, port };
