import { launches } from "../../models/launches.model.js";

export const getAllHistoricLaunches = (_req, res) => res.status(200).json(Array.from(launches.values()))