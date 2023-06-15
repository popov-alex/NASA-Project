import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { planetsRouter } from './routes/planets/planets.router.js';
import { launchesRouter } from './routes/launches/launches.router.js';

export const app = express();

app.use(morgan('short'))
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(planetsRouter);
app.use(launchesRouter)
app.get('/', (_req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
);
