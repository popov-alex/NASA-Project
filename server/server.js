import http from 'http';
import dotenv from 'dotenv';

import { mongoConnect } from './src/services/mongo.js';
import { app } from './src/app.js';
import { loadPlanets } from './src/models/planets.model.js';
import { getSpaceXFlights } from './src/models/launches.model.js';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

(async function startServer() {
  try {
    await mongoConnect();
    await getSpaceXFlights();
    await loadPlanets();
    server.listen(PORT, () =>
      console.log(`I am happy to listen on PORT ${PORT}`)
    );
  } catch (error) {
    console.error(`Error loading data: ${error}`);
  }
})();
