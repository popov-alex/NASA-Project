import { launches } from './launches.mongo.js';

const DEFAULT_LAUNCH_NUM = 100;

const defaultLaunch = {
  flightNumber: 100,
  launchDate: new Date('June 27, 2023'),
  mission: 'Landing on Marse',
  rocket: 'Souz',
  customers: ['Kris', 'Lena'],
  success: true,
  upcoming: true,
  target: 'Kepler 442 b',
};

launches.updateOne(defaultLaunch);

export const getAllHistoricLaunches = () => launches.find({});

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort(-flightNumber);

  if (!latestLaunch) {
    return DEFAULT_LAUNCH_NUM;
  }

  return latestLaunch.flightNumber;
};

const getNextFlightNumber = async () => {
  const latestLaunch = await getLatestFlightNumber();

  return latestLaunch.flightNumber++;
};

export const postNewLaunch = async (incomingLaunch) => {
  const newLaunch = {
    ...incomingLaunch,
    flightNumber: getNextFlightNumber(),
    customers: defaultLaunch.customers,
    success: true,
    upcoming: true,
    launchDate: new Date(incomingLaunch.launchDate),
  };

  await launches.updateOne({flightNumber: newLaunch.flightNumber}, newLaunch, { upsert: true });
};

export const abortLaunch = (id) => {
  const abortedLaunch = launches.get(id);
  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;
  return abortLaunch;
};
