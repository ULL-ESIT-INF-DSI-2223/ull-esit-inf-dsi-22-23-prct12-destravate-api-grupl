import request from 'supertest';
import { app } from '../src/app.js';
import { GroupsModel } from '../src/models/groups.js';
import { expect } from 'chai';

await GroupsModel.deleteMany();



const group1 = {
  id: 1,
  name: "grupo1",
  participants: [],
  stats: [[0, 0], [0, 0], [0, 0]],
  ranking: [],
  favouriteRoutes: [],
  historicRoutes: []
}

const group2 = {
  id: 2,
  name: "grupo2",
  participants: [],
  stats: [[0, 0], [0, 0], [0, 0]],
  ranking: [],
  favouriteRoutes: [],
  historicRoutes: [{
    date: "11-05-2023",
    route:["1"]
  }]
}

describe('POST /groups', () => {
  it('Should create a group successfully', async () => {
    await request(app).post('/groups').send(group1).expect(201);
  });
  it('Should return 500 if the group exists', async () => {
    await request(app).post('/groups').send(group1).expect(500);
  });
});

describe('GET /groups', () => {
  it('Should get a group by its id', async () => {
    const response = await request(app).get('/groups/1').send(group1).expect(200);
  });
  it('Should get a group by its name', async () => {
    const response = await request(app).get('/groups?name=grupo1').send(group1).expect(200);
  });
  it('Group does not existe should return 404', async () => {
    await request(app).get('/groups?name=grupo2').send(group1).expect(404);
  });
});

describe('PATCH /groups', () => {
  it('Should modify a groups name by its id successfully', async () => {
    await request(app).patch('/groups/1').send({name: "grupo1modificado"}).expect(201);
  });
  it('Should modify a groups name by its name successfully', async () => {
    await request(app).patch('/groups?name=grupo1modificado').send({name: "grupo1modificado2"}).expect(201);
  });
  it('Group does not exist should return 404', async () => {
    await request(app).patch('/groups?name=grupo2').send({name: "gruponoexiste"}).expect(404);
  });
});

describe('DELETE /groups', () => {
  it('Should delete a group by its id successfully', async () => {
    await request(app).delete('/groups/1').send().expect(200);
  });
  it('Should delete a groups name by its name successfully', async () => {
    await request(app).post('/groups').send(group2);
    await request(app).delete('/groups?name=grupo2').send().expect(200);
  });
  it('Group does not exist should return 404', async () => {
    await request(app).delete('/groups?name=grupo3').send().expect(404);
  });
});