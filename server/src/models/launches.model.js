export const launches = new Map()

const launch = {
    flightNumber: 100,
    name: 'Alex',
    destination: 'USA',
    accompanied: ['Elena', 'Kristina']
}

launches.set(launch.flightNumber, launch)