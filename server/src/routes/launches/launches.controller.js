import {
  abortLaunch,
  getAllHistoricLaunches,
  postNewLaunch,
} from '../../models/launches.model.js';

export const httpGetAllHistoricLaunches = (_req, res) =>
  res.status(200).json(getAllHistoricLaunches());

export const httpPostNewLaunch = (req, res) => {
  const newLaunch = req.body;

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

  postNewLaunch(newLaunch);

  return res.status(201).json(newLaunch);
};

export const httpAbortLaunch = (req, res) => {
  const id = +req.params.id;

  const aborted = abortLaunch(id);

  res.status(200).json(aborted);
};
