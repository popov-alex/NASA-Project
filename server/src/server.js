import http from 'http';
import mongoose from 'mongoose';

import { app } from './app.js';
import { loadPlanets } from './models/planets.model.js';

const PORT = process.env.ROOT || 8000;

const server = http.createServer(app);

const MONGODB_URL = 'mongodb+srv://Sasha:Sasha@nasa-api.bc2sczc.mongodb.net/';

mongoose.connection.once('open', () => console.log('MongoDB is ready!'));

mongoose.connection.on('error', (err) => console.error(err));


(async function startServer() {
    try {
      await mongoose.connect(MONGODB_URL);
      await loadPlanets();
      server.listen(PORT, () =>
        console.log(`I am happy to listen on PORT ${PORT}`)
      );
    } catch (error) {
      console.error(`Error loading data: ${error}`);
    }
  }
)();
