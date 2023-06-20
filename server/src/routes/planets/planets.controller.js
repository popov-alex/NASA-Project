import { getAllPlanets } from '../../models/planets.model.js';

export const httpGetAllPlanets = async (_req, res) =>
  res.status(200).json(await getAllPlanets());
