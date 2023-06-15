import { planets } from '../../models/planets.model.js';

export const getAllPlanets = (_req, res) => res.status(200).json(planets);
