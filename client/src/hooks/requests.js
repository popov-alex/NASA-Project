const API_URL = 'http://localhost:8000';
const LAUNCHES_ENDPOINT = `${API_URL}/launches`;

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(LAUNCHES_ENDPOINT);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const parsedLaunces = await response.json();
  return parsedLaunces.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  return await fetch(LAUNCHES_ENDPOINT, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(launch),
  });
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${LAUNCHES_ENDPOINT}/${id}`, {
      method: 'delete',
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
