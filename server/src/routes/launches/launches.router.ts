import express from 'express';
import {
  httpAbortLaunch,
  httpGetAllHistoricLaunches,
  httpPostNewLaunch,
} from './launches.controller';

export const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllHistoricLaunches);
launchesRouter.post('/', httpPostNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);
