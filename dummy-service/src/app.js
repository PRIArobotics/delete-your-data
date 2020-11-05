import express from 'express';
import { initSequelize } from './models';
import createApi from './api';

export default async function createApp() {
  const app = express();

  // register API routes before nuxt middleware
  app.use('/api', createApi());

  // check DB connection & synchronize models
  await initSequelize();

  return app;
}

export const host = 'localhost';
export const port = 3001;
