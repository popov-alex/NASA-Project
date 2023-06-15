import http from 'http';
import { app } from './app.js';
import { loadPlanets } from './models/planets.model.js';

const PORT = process.env.ROOT || 8000;

const server = http.createServer(app);

(async function startServer() {
  try {
    await loadPlanets();
    server.listen(PORT, () =>
      console.log(`I am happy to listen on PORT ${PORT}`)
    );
  } catch (error) {
    console.error(`Error loading data: ${error}`);
  }
})();
