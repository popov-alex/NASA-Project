import express, { Request, Response } from 'express';

import { getPagination } from '../common/queryHelpers';
import {
  IncomingLaunch,
  abortLaunch,
  getAllHistoricLaunches,
  postNewLaunch,
} from './launches.service';

export const launchesRouter = express.Router();

launchesRouter.get('/', async (req: Request, res: Response) => {
  const { size, num } = req.query;
  const { pageSkip, pageSize } = getPagination(size, num);

  const allLaunches = await getAllHistoricLaunches(pageSkip, pageSize);

  res.status(200).json(allLaunches);
});

launchesRouter.post('/', async (req: Request, res: Response) => {
  const newLaunch: IncomingLaunch = req.body;

  if (
    !newLaunch.mission ||
    !newLaunch.target ||
    !newLaunch.launchDate ||
    !newLaunch.rocket
  ) {
    return res.status(401).json({
      error: 'Complete all fields',
    });
  } else if (!isNaN(newLaunch.launchDate)) {
    return res.status(401).json({
      error: 'Please provide the correct date',
    });
  }

  const newLaunchResult = await postNewLaunch(newLaunch);

  return res.status(201).json(newLaunchResult);
});

launchesRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = +req.params.id;

  const aborted = await abortLaunch(id);
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch was not aborted',
    });
  }

  return res.status(200).json({
    success: `Successfully aborted launch with flightNumber ${id}`,
  });
});
