import { getAllPlanets } from '../../models/planets.model.js';

export const httpGetAllPlanets = (_req, res) =>
  res.status(200).json(getAllPlanets());
