import axios from 'axios';

import { launches } from './launches.mongo.js';
import { planets } from './planets.mongo.js';

const DEFAULT_LAUNCH_NUM = 100;

const defaultLaunch = {
  flightNumber: 100,
  launchDate: new Date('June 27, 2023'),
  mission: 'Landing on Marse',
  rocket: 'Souz',
  customers: ['Kris', 'Lena'],
  success: true,
  upcoming: true,
  target: 'Kepler-442 b',
};

const saveLaunch = async (launch) => {
  const isExistingPlanet = await planets.findOne({ keplerName: launch.target });

  if (!isExistingPlanet) {
    throw new Error("Planet's name should be from the approved list");
  }
  await launches.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
};

saveLaunch(defaultLaunch);

// const SPACEX_LAUNCHES_ENDPOINT = 'https://api.spacexdata.com/v4/launches/query';

// export const getSpaceXFlights = async () => {
//   const response = await axios.get(SPACEX_LAUNCHES_ENDPOINT, {
//     query: {},
//     options: {
//       populate: [
//         {
//           path: 'rocket',
//           select: {
//             name: 1,
//           },
//           path: 'payloads',
//           select: {
//             customers: 1,
//           },
//         },
//       ],
//     },
//   });
//   console.log(response.data);
// };

export const getAllHistoricLaunches = () =>
  launches.find({}, { _id: 0, __v: 0 });

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_LAUNCH_NUM;
  }

  return latestLaunch;
};

const getNextFlightNumber = async () => {
  const latestLaunch = await getLatestFlightNumber();

  const incrementedFlightNumber = latestLaunch
    ? latestLaunch.flightNumber + 1
    : DEFAULT_LAUNCH_NUM;

  return incrementedFlightNumber;
};

export const postNewLaunch = async (incomingLaunch) => {
  const newLaunch = {
    flightNumber: await getNextFlightNumber(),
    customers: defaultLaunch.customers,
    success: true,
    upcoming: true,
    launchDate: new Date(incomingLaunch.launchDate),
    ...incomingLaunch,
  };

  try {
    await saveLaunch(newLaunch);
  } catch (err) {
    console.error(err);
  }
};

export const abortLaunch = async (id) => {
  const abortedLaunch = await launches.updateOne(
    { flightNumber: id },
    { upcoming: false, success: false }
  );

  return abortedLaunch.modifiedCount === 1;
};
