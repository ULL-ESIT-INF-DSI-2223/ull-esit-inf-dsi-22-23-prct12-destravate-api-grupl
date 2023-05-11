import request from 'supertest';
import { app } from '../src/app.js';
import { Users } from '../src/models/users.js';
import { expect } from 'chai';

const user0 = {
  id: 0,
  name: "default",
  activities: "correr",
  friends: [],
  groups: [],
  stats: [[0, 0], [0, 0], [0, 0]],
  favRoutes:[],
  activeChallenges: [],
  historicRoutes: []
}

const user = {
  id: 1,
  name: "isma",
  activities: "correr",
  friends: [],
  groups: [],
  stats: [[0, 0], [0, 0], [0, 0]],
  favRoutes:[],
  activeChallenges: [],
  historicRoutes: []
}
const user1 = {
  id: 2,
  name: "albert",
  activities: "correr",
  friends: [],
  groups: [],
  stats: [[0, 0], [0, 0], [0, 0]],
  favRoutes:[],
  activeChallenges: [],
  historicRoutes: [{
    date: "11-05-2023",
    route:["1"]
  }]
}


await Users.deleteMany();



describe('POST /users', () => {
  it('Should successfully create a new user', async () => {
    await request(app).post('/users').send(user).expect(201);
    });
  it('Should successfully create a new user', async () => {
    await request(app).post('/users').send(user1).expect(201);
    });
  it('Should fail to create a new user', async () => {
    await request(app).post('/users').send({}).expect(500);
    });
  it('Should fail to create a new user', async () => {
    await request(app).post('/').send(user).expect(501);
    });
});

describe('GET /users', () => {
  it('Should successfully get user 1', async () => {
    await request(app).get('/users/1').expect(200);
    });
  it('Should fail to get  user 2', async () => {
    await request(app).get('/users?name=albert').expect(200);
    });
  it('Should fail to get user 3', async () => {
    await request(app).get('/users/3').expect(404);
    }); 
  it('Should fail to get user 4', async () => {
    await request(app).get('/users?name=alberto').expect(404);
  });
});

describe('PATCH /users', () => {
  it('Should successfully update user 1', async () => {
    await request(app).patch('/users/1').send({name: "ismael"}).expect(200);
    });
  it('Should successfully update user 2', async () => {
    await request(app).patch('/users?name=albert').send({name: "alberto"}).expect(200);
    });
  it('Should fail to update user 3', async () => {
    await request(app).patch('/users/3').send({username: "alberto"}).expect(400);
    });
  it('Should fail to update user 4', async () => {
    await request(app).patch('/users?name=alberti').send({username: "alberto"}).expect(400);
    });
});

describe('DELETE /users', () => {
  it('Should successfully delete user 1', async () => {
    await request(app).delete('/users/1').expect(200);
    });
  it('Should successfully delete user 2', async () => {
    await request(app).delete('/users?name=alberto').expect(200);
    });
  it('Should fail to delete user 3', async () => {
    await request(app).delete('/users/3').expect(404);
    });
  it('Should fail to delete user 4', async () => {
    await request(app).delete('/users?name=alberti').expect(404);
    });
});

