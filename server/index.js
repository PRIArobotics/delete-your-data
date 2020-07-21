const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const { sequelize } = require('../models');
const app = express();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);
  const { host, port } = nuxt.options.server;

  await nuxt.ready();

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // register API routes before nuxt middleware
  require('./routes')(app);

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

  app.listen(port, host);
  consola.success({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

start();
