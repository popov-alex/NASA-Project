import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';

import { PlanetDocument, planets } from './planets.mongo';
interface PlanetsFromFile {
  kepler_name: string;
  koi_disposition: string;
  koi_insol: number;
  koi_prad: number;
}

const isPlanetHabitable = (planet: PlanetsFromFile) =>
  planet.koi_disposition === 'CONFIRMED' &&
  planet.koi_insol > 0.36 &&
  planet.koi_insol < 1.11 &&
  planet.koi_prad < 1.6;

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

export const loadPlanets = async (): Promise<void> => {
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join('data', 'kepler_data.csv'))
        .pipe(
          parse({
            comment: '#',
            columns: true,
          })
        )
        .on('data', async (data) => {
          if (isPlanetHabitable(data)) {
            await savePlanet(data);
          }
        })
        .on('error', reject)
        .on('end', resolve);
    });

    const numberOfPlanets: PlanetDocument[] = await getAllPlanets();
    console.log(`We found ${numberOfPlanets.length} planets habitable!`);
  } catch (err) {
    console.log('Error occurred', err);
    throw err;
  }
};
