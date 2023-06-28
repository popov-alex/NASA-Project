import { getAllPlanets } from '../../models/planets.model.js';
import { getPagination } from '../../services/queryHelpers.js';

export const httpGetAllPlanets = async (_req, res) => {
  res.status(200).json(await getAllPlanets());
};
