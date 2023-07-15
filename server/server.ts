import http from 'http';
import dotenv from 'dotenv';

import { mongoConnect } from './src/common/mongo';
import { app } from './src/app';
import { loadPlanets } from './src/planets/planets.service';
import { getSpaceXFlights } from './src/launches/launches.service';

dotenv.config({ path: __dirname + '/../.env' });

const PORT: string | number = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await mongoConnect(process.env.MONGODB_URL as string);
    await getSpaceXFlights();
    await loadPlanets();
    server.listen(PORT, () =>
      console.log(`I am happy to listen on PORT ${PORT}`)
    );
  } catch (error) {
    console.error(`Error loading data: ${error}`);
  }
};

startServer();
