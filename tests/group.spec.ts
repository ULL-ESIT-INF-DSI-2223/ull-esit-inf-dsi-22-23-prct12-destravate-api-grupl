import request from 'supertest';
import { app } from '../src/app.js';
import { GroupsModel } from '../src/models/groups.js';
import { Users } from '../src/models/users.js';
import { expect } from 'chai';



describe('Groups', () => {

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
  const group3 = {
    id: 3,
    name: "grupo3",
    participants: [1],
    stats: [[0, 0], [0, 0], [0, 0]],
    ranking: [],
    favouriteRoutes: [],
    historicRoutes: [{
      date: "11-05-2023",
      route:["1"]
    }]
  }
  const group4 = {
    id: 4,
    name: "grupo4",
    participants: [100],
    stats: [[0, 0], [0, 0], [0, 0]],
    ranking: [],
    favouriteRoutes: [],
    historicRoutes: [{
      date: "11-05-2023",
      route:["1"]
    }]
  }
  const group5 = {
    id: 5,
    name: "grupo5",
    participants: [],
    stats: [[0, 0], [0, 0], [0, 0]],
    ranking: [],
    favouriteRoutes: [100],
    historicRoutes: [{
      date: "11-05-2023",
      route:["1"]
    }]
  }
  const user = {
    id: 1,
    name: "isma",
    activities: "correr",
    friends: [],
    groups: [],
    stats: [[0, 0], [0, 0], [0, 0]],
    favRoutes:[],
    activeChallenges: []
  }
  
  before(async () => {
    await GroupsModel.deleteMany({});
    await Users.deleteMany();
    await new Users(user).save();
  });

  describe('POST /groups', () => {


    it('Should create a group successfully', async () => {
      await request(app).post('/groups').send(group1).expect(201);
    });
    it('Should create a group successfully', async () => {
      await request(app).post('/groups').send(group3).expect(201);
    });
    it('Should fail to create a group where user does not exists', async () => {
      await request(app).post('/groups').send(group4).expect(404);
    });
    it('Should fail to create a group where user does not exists', async () => {
      await request(app).post('/groups').send(group5).expect(404);
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
      await request(app).patch('/groups/1').send({name: "grupo1modificado"}).expect(200);
    });
    it('Should modify a groups name by its name successfully', async () => {
      await request(app).patch('/groups?name=grupo1modificado').send({name: "grupo1modificado2"}).expect(200);
    });
    it('Group does not exist should return 404', async () => {
      await request(app).patch('/groups?name=grupo2').send({name: "gruponoexiste"}).expect(404);
    });
    it('Group does not permited modify an atribute that no exist', async () => {
      await request(app).patch('/groups?name=grupo2').send({Username: "gruponoexiste"}).expect(400);
    });

    it('Group allows to update, adding a user by the groups name', async () => {
      await request(app).patch('/groups?name=grupo1modificado2').send({participants: [1]}).expect(200);
    });
    it('Group should fail to update, adding a user that not exist, by the groups name', async () => {
      await request(app).patch('/groups?name=grupo1modificado2').send({participants: [100]}).expect(404);
    });
    it('Group allows to update, adding a user by the groups id', async () => {
      await request(app).patch('/groups/3').send({participants: [1]}).expect(200);
    });
    it('Group should fail to update, adding a user that not exist, by the groups id', async () => {
      await request(app).patch('/groups/3').send({participants: [1000]}).expect(404);
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
      await request(app).delete('/groups?name=grupo100').send().expect(404);
    });
  });

});