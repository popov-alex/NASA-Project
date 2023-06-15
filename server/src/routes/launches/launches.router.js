import express from 'express';
import { getAllHistoricLaunches } from './launches.controller.js';

export const launchesRouter = express.Router();

launchesRouter.get('/launches', getAllHistoricLaunches);
