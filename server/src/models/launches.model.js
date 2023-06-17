//its obviously not the best data sctructure here, but I decided to follow the course just for the sake of curiousity. a more appopriate would be {}[]

export const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  launchDate: new Date('June 27, 2023'),
  mission: 'Landing on Marse',
  rocket: 'Souz',
  customers: ['Kris', 'Lena'],
  success: true,
  upcoming: true,
  target: 'Kepler 442 b',
};

launches.set(launch.flightNumber, launch);

export const getAllHistoricLaunches = () => Array.from(launches.values());

export const postNewLaunch = (incomingLaunch) => {
  latestFlightNumber++;
  launches.set(latestFlightNumber, {
    ...incomingLaunch,
    flightNumber: latestFlightNumber,
    customers: launch.customers,
    success: true,
    upcoming: true,
    launchDate: new Date(incomingLaunch.launchDate),
  });
};

export const abortLaunch = (id) => {
  const abortedLaunch = launches.get(id);
  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;
  return abortLaunch;
};
