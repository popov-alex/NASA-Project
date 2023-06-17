import express from 'express';
import {
  httpAbortLaunch,
  httpGetAllHistoricLaunches,
  httpPostNewLauch,
} from './launches.controller.js';

export const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllHistoricLaunches);
launchesRouter.post('/', httpPostNewLauch);
launchesRouter.delete('/:id', httpAbortLaunch);
