import axios from 'axios';

import { LaunchDocument, launches } from './launches.mongo';
import { PlanetDocument, planets } from './planets.mongo';

const SPACEX_LAUNCHES_ENDPOINT = 'https://api.spacexdata.com/v4/launches/query';

const DEFAULT_LAUNCH_NUM: number = 100;

interface Launch {
  flightNumber: number;
  launchDate: Date;
  mission: string;
  rocket: string;
  customers: string[];
  success: boolean;
  upcoming: boolean;
  target: string;
}

type LaunchWithoutTarget = Omit<Launch, 'target'>;

const defaultLaunch: Launch = {
  flightNumber: 100,
  launchDate: new Date('June 27, 2023'),
  mission: 'Landing on Marse',
  rocket: 'Souz',
  customers: ['Kris', 'Lena'],
  success: true,
  upcoming: true,
  target: 'Kepler-442 b',
};

const saveLaunch = async (launch: Launch | LaunchWithoutTarget) => {
  await launches.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
};

saveLaunch(defaultLaunch);

interface SpaceXLaunchDocType {
  flight_number: number;
  date_local: Date;
  name: string;
  rocket: {
    name: string;
  };
  payloads: {
    customers: string[];
  }[];
  success: boolean;
  upcoming: boolean;
}

interface SpaceXApiResponse {
  docs: SpaceXLaunchDocType[];
}

interface AxiosResponseFromSpaceX {
  status: number;
  statusText: string;
  data: SpaceXApiResponse;
}

export const getSpaceXFlights = async () => {
  const response: AxiosResponseFromSpaceX = await axios.post(
    SPACEX_LAUNCHES_ENDPOINT,
    {
      query: {},
      options: {
        limit: 20,
        populate: [
          {
            path: 'rocket',
            select: {
              name: 1,
            },
          },
          {
            path: 'payloads',
            select: {
              customers: 1,
            },
          },
        ],
      },
    }
  );

  if (response.status !== 200) {
    console.error({
      error: 'Not able to load SpaceX launches',
    });
    throw new Error('Problem loading SpaceX launches');
  }

  response.data.docs.map(async (doc: SpaceXLaunchDocType) => {
    const customers = doc.payloads.flatMap((payload) => payload.customers);

    const launch: LaunchWithoutTarget = {
      flightNumber: doc.flight_number,
      launchDate: doc.date_local,
      mission: doc.name,
      rocket: doc.rocket.name,
      customers,
      success: doc.success,
      upcoming: doc.upcoming,
    };

    await saveLaunch(launch);
  });
};

export const getAllHistoricLaunches = async (
  pageNum: number,
  pageSize: number
) => {
  const historicLaunches: LaunchDocument[] = await launches
    .find({}, { _id: 0, __v: 0 })
    .sort('flightNumber')
    .skip(pageNum)
    .limit(pageSize);

  return historicLaunches;
};

const getLatestFlightNumber = async () => {
  const latestLaunch: LaunchDocument | null = await launches
    .findOne()
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_LAUNCH_NUM;
  }

  return latestLaunch?.flightNumber;
};

const getNextFlightNumber = async () => {
  const latestLaunch: number = await getLatestFlightNumber();

  const incrementedFlightNumber = latestLaunch
    ? latestLaunch + 1
    : DEFAULT_LAUNCH_NUM;

  return incrementedFlightNumber;
};

interface IncomingLaunch {
  launchDate: Date;
  mission: string;
  rocket: string;
  target: string;
}

export const postNewLaunch = async (incomingLaunch: IncomingLaunch) => {
  const isExistingPlanet: PlanetDocument | null = await planets.findOne({
    keplerName: incomingLaunch.target,
  });

  if (!isExistingPlanet) {
    throw new Error("Planet's name should be from the approved list");
  }

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

export const abortLaunch = async (id: number) => {
  const abortedLaunch = await launches.updateOne(
    { flightNumber: id },
    { upcoming: false, success: false }
  );

  return abortedLaunch.modifiedCount === 1;
};
