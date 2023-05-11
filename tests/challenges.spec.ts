import request from 'supertest';
import { app } from '../src/app.js';
import { Challenges } from '../src/models/challenges.js';
import { expect } from 'chai';



await Challenges.deleteMany();


const challenge1 = {
  id: 1,
  name: "challenge1",
  ruteChallenge: [],
  typeActivities: "correr",
  kmTotal: 20,
  idUsersChallenge: []
};

const challenge2 = {
  id: 2,
  name: "challenge2",
  ruteChallenge: [],
  typeActivities: "correr",
  kmTotal: 20,
  idUsersChallenge: []
};


describe('POST /challenges', () => {
  it('Should create a challenge successfully', async () => {
    await request(app).post('/challenges').send(challenge1).expect(201);
  });
  it('Should return 500 if the challenge exists', async () => {
    await request(app).post('/challenges').send(challenge1).expect(500);
  });
});

describe('GET /challenges', () => {
  it('Should get a challenge by its id', async () => {
    const response = await request(app).get('/challenges/1').send(challenge1).expect(200);
  });
  it('Should get a challenge by its name', async () => {
    const response = await request(app).get('/challenges?name=challenge1').send(challenge1).expect(200);
  });
  it('Challenge does not existe should return 404', async () => {
    await request(app).get('/challenges?name=challenge3').send().expect(404);
  });
});

describe('PATCH /challenges', () => {
  it('Should modify a challenge name by its id successfully', async () => {
    await request(app).patch('/challenges/1').send({name: "challenge1modificado"}).expect(200);
  });
  it('Should modify a challenge name by its name successfully', async () => {
    await request(app).patch('/challenges?name=challenge1modificado').send({name: "challenge1modificado2"}).expect(200);
  });
  it('Challenge does not exist should return 404', async () => {
    await request(app).patch('/challenges?name=challenge2').send({name: "challenge2modificado"}).expect(404);
  });
});

describe('DELETE /challenges', () => {
  it('Should delete a challenge by its id successfully', async () => {
    await request(app).patch('/challenges/1').send().expect(200);
  });
  it('Should modify a challenge name by its name successfully', async () => {
    await request(app).post('/challenges').send(challenge2);
    await request(app).delete('/challenges?name=challenge2').send().expect(200);
  });
  it('Challenge does not exist should return 404', async () => {
    await request(app).delete('/challenges?name=challenge3').send().expect(404);
  });
});