import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url || '');
// const __dirname = dirname(__filename);

export const planets = [];

function isPlanetHabitable(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

export const loadPlanets = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(process.cwd(), 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', (data) => isPlanetHabitable(data) && planets.push(data))
      .on('error', (err) => {
        console.log('Error occured', err);
        reject(err);
      })
      .on('end', () => {
        console.log(`We found ${planets.length} planets habitable!`);
        resolve();
      });
  });
};

export const getAllPlanets = () => planets;
