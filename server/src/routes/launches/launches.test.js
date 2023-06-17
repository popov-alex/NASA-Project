import request from 'supertest';
import { app } from '../../app.js';

describe('Test GET /launches', () => {
  test('It respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /launches', () => {
  const payload = {
    launchDate: 'June 27, 2023',
    mission: 'Landing on Marse',
    rocket: 'Souz',
    target: 'Kepler 442 b',
  };

  test('It responds with 201 created', () => {
    const response = request(app)
      .post('/launches')
      .send(payload)
      .expect('Content-Type', /json/)
      .expect(201);

    expect({
      ...response.body,
      launchDate: new Date(response.body.launchDate).valueOf(),
    }).toMatchObject({
      ...payload,
      launchDate: new Date(response.body.launchDate).valueOf(),
    });
  });

  test('It should catch missing required properties', async () => {
    const { launchDate, ...payloadWithoutDate } = payload;
    const response = await request(app)
      .post('/launches')
      .send(payloadWithoutDate)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toStrictEqual({
      error: 'Complete all fields',
    });
  });

  test('It catch invalid dates', async () => {
    const modifiedPayload = { ...payload, launchDate: 'Friday' };
    const response = await request(app)
      .post('/launches')
      .send(modifiedPayload)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  expect(response.body).toStrictEqual({
    error: 'Please provide the correct date',
  });
});

describe('Test DELETE /launches/:id', () => {
  test('It should delete a chosen launch', () => {});
});
