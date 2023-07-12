import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

import { PlanetDocument, planets } from './planets.mongo.js';

interface PlanetsFromFile {
  kepler_name: string;
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
}

function isPlanetHabitable(planet: PlanetsFromFile) {
  return (
    planet.koi_disposition === 'CONFIRMED' &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
}

export const getAllPlanets = (): Promise<PlanetDocument[]> =>
  planets.find({}, { _id: 0, __v: 0 });

export const savePlanet = async (planet: PlanetsFromFile) => {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.log(`Could not save ${err}`);
  }
};

export const loadPlanets = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(process.cwd(), 'data', 'kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on(
        'data',
        async (data) => isPlanetHabitable(data) && savePlanet(data)
      )
      .on('error', (err) => {
        console.log('Error occurred', err);
        reject(err);
      })
      .on('end', async () => {
        const numberOfPlanets: PlanetDocument[] = await getAllPlanets();
        numberOfPlanets &&
          console.log(`We found ${numberOfPlanets.length} planets habitable!`);
        resolve();
      });
  });
};
