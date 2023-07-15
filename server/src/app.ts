import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';

import { planetsRouter } from './planets/planets.controller';
import { launchesRouter } from './launches/launches.controller';

export const app = express();

app.use(morgan('common'));
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
);
