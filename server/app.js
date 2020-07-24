const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const { sequelize } = require('../models');
const apiRoutes = require('./apiRoutes');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

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
};

module.exports.appPromise = createApp();

const { host, port } = nuxt.options.server;
module.exports.host = host;
module.exports.port = port;
