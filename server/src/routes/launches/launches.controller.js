import {
  abortLaunch,
  getAllHistoricLaunches,
  postNewLaunch,
} from '../../models/launches.model.js';
import { getPagination } from '../../services/queryHelpers.js';

export const httpGetAllHistoricLaunches = async (req, res) => {
  const { size, num } = req.query;

  const { pageSkip, pageSize } = getPagination(size, num);

  res.status(200).json(await getAllHistoricLaunches(pageSkip, pageSize));
};

export const httpPostNewLaunch = async (req, res) => {
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

  await postNewLaunch(newLaunch);

  return res.status(201).json(newLaunch);
};

export const httpAbortLaunch = async (req, res) => {
  const id = +req.params.id;

  const aborted = await abortLaunch(id);
  if (!aborted) {
    return res.send(400).json({
      error: 'Launch was not aborted',
    });
  }

  return res.status(200).json({
    success: `Successfully aborted launch with flightNumber ${id}`,
  });
};
