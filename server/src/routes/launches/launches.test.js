import request from 'superagent';
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
  test('It respond with 200 success', () => {});

  test('It should catch missing required properties', () => {});

  test('It catch invalid dates', () => {});
});

describe('Test DELETE /launches/:id', () => {
  test('It should delete a chosen launch', () => {});
});
