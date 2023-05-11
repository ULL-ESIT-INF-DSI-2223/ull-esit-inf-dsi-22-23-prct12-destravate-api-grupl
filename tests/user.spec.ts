/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Práctica 12: API REST Destravate
 * @author Ismael Martín Herrera
 * @author Alberto Zarza Martín
 * @email alu0101397375@ull.edu.es
 * @date 15/05/2023
 */

import request from 'supertest';
import { app } from '../src/app.js';
import { Users } from '../src/models/users.js';
import { expect } from 'chai';
import { GroupsModel } from '../src/models/groups.js';
import { Track } from '../src/models/tracks.js';
import { Challenges } from '../src/models/challenges.js';


describe('User All', () => {
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
  
  
  const user8 = {
    id: 8,
    name: "marco",
    activities: "correr",
    friends: [],
    groups: [],
    stats: [[0, 0], [0, 0], [0, 0]],
    favRoutes:[],
    activeChallenges: [],
    historicRoutes: []
  }
  
  
  const group1 = {
    id: 1,
    name: "grupo1",
    participants: [],
    stats: [[0, 0], [0, 0], [0, 0]],
    ranking: [],
    favouriteRoutes: [],
    historicRoutes: []
  }
  
  const track1 = {
    id: 1,
    name: "track1",
    initialGeo: [0,0.2],
    finalGeo: [0.1,0],
    kmLength: 1000,
    avegLevel: 99,
    users: [],
    activityType: "correr",
    avegMark: 10
  }
  
  const challenge1 = {
    id: 1,
    name: "challenge1",
    ruteChallenge: [],
    typeActivities: "correr",
    kmTotal: 20,
    idUsersChallenge: []
  };
  
  before(async () => {
    await Users.deleteMany();
    await GroupsModel.deleteMany();
    await new GroupsModel(group1).save();
    await Track.deleteMany();
    await new Track(track1).save();
    await Challenges.deleteMany();
    await new Challenges(challenge1).save();
    await new Users(user0).save();
  }); 

  describe('POST /users', () => {
    it('Should successfully create a new user', async () => {
      await request(app).post('/users').send(user).expect(201);
      });
    it('Should successfully create a new user', async () => {
      await request(app).post('/users').send(user1).expect(201);
      });
    it ('Should successfully create a new user', async () => {
      await request(app).post('/users').send(user8).expect(201);
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
    it('Should successfully update friends user 1', async () => {
      await request(app).patch('/users/1').send({friends: [0]}).expect(200);
    });   
    it('Should successfully update groups user 1', async () => {
      await request(app).patch('/users/1').send({groups: [1]}).expect(200);
    });
    it('Should successfully update f user 1', async () => {   
      await request(app).patch('/users/1').send({favRoutes: [1]}).expect(200);
    });
    it('Should successfully update activeChallenges user 1', async () => {
      await request(app).patch('/users/1').send({activeChallenges: [1]}).expect(200);
    });
    it('Should fail to update friends user 1', async () => {
      await request(app).patch('/users/1').send({friends: [110]}).expect(404);
    });   
    it('Should fail to update groups user 1', async () => {
      await request(app).patch('/users/1').send({groups: [110]}).expect(404);
    });
    it('Should fail to update f user 1', async () => {   
      await request(app).patch('/users/1').send({favRoutes: [110]}).expect(404);
    });
    it('Should fail to update activeChallenges user 1', async () => {
      await request(app).patch('/users/1').send({activeChallenges: [111]}).expect(404);
    });


    it('Should successfully update friends user 1', async () => {
      await request(app).patch('/users?name=marco').send({friends: [0]}).expect(200);
    });   
    it('Should successfully update groups user 1', async () => {
      await request(app).patch('/users?name=marco').send({groups: [1]}).expect(200);
    });
    it('Should successfully update f user 1', async () => {   
      await request(app).patch('/users?name=marco').send({favRoutes: [1]}).expect(200);
    });
    it('Should successfully update activeChallenges user 1', async () => {
      await request(app).patch('/users?name=marco').send({activeChallenges: [1]}).expect(200);
    });
    it('Should fail to update friends user 1', async () => {
      await request(app).patch('/users?name=marco').send({friends: [110]}).expect(404);
    });   
    it('Should fail to update groups user 1', async () => {
      await request(app).patch('/users?name=marco').send({groups: [110]}).expect(404);
    });
    it('Should fail to update f user 1', async () => {   
      await request(app).patch('/users?name=marco').send({favRoutes: [110]}).expect(404);
    });
    it('Should fail to update activeChallenges user 1', async () => {
      await request(app).patch('/users?name=marco').send({activeChallenges: [111]}).expect(404);
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
});
