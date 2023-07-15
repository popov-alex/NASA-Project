import express from 'express';
import { Request, Response } from 'express';

import { getAllPlanets } from './planets.service';

export const planetsRouter = express.Router();

planetsRouter.get('/', async (_req: Request, res: Response) => {
  const planets = await getAllPlanets();
  res.status(200).json(planets);
});
