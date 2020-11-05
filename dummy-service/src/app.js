import express from 'express';
import axios from 'axios';

import { initSequelize } from './models';
import createApi from './api';

export default async function createApp({
  dydEndpoint,
  dydPluginUuid,
}) {
  const dydAxios = axios.create({
    baseURL: dydEndpoint,
  });

  const app = express();

  // register API routes before nuxt middleware
  app.use('/api', createApi({ dydAxios, dydPluginUuid }));

  // check DB connection & synchronize models
  await initSequelize();

  return app;
}

export const host = 'localhost';
export const port = 3001;
