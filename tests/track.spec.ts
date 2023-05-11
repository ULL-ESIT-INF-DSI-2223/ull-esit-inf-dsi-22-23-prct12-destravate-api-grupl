import request from 'supertest';
import { app } from '../src/app.js';
import { Track } from '../src/models/tracks.js';
import { Users } from '../src/models/users.js';
import { GroupsModel } from '../src/models/groups.js';
import { expect } from 'chai';
import { Challenges } from '../src/models/challenges.js';

describe('Tracks', () => {
  const track = {
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

  const track2 = {
    id: 2,
    name: "track2",
    initialGeo: [0,0.2],
    finalGeo: [0.1,0],
    kmLength: 1000,
    avegLevel: 99,
    users: [1],
    activityType: "correr",
    avegMark: 10
  }

  const track3 = {
    id: 3,
    name: "track3",
    initialGeo: [0,0.2],
    finalGeo: [0.1,0],
    kmLength: 1000,
    avegLevel: 99,
    users: [100],
    activityType: "correr",
    avegMark: 10
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
    await Users.deleteMany();
    await Track.deleteMany();
    await GroupsModel.deleteMany();
    await Challenges.deleteMany();
    await new Users(user).save();
  });


  describe('POST /tracks', () => {
    it('Should successfully create a new track', async () => {
      await request(app).post('/tracks').send(track).expect(201);
    });

    it('Should successfully create a new track', async () => {
      await request(app).post('/tracks').send(track2).expect(201);
    });

    it('Should fail to create a new track3 with non existig user', async () => {
      await request(app).post('/tracks').send(track3).expect(404);
    });
    
    it('Should fail to create a new track', async () => {
      await request(app).post('/tracks').send(track).expect(500);
    });

    it('Should fail to create a new track', async () => {
      await request(app).post('/tracks').send(track2).expect(500);
    });
  });

  describe('GET /tracks', () => {
    it('Should successfully get track 1', async () => {
      await request(app).get('/tracks/1').expect(200);
    });
    it('Should successfully get track 2', async () => {
      await request(app).get('/tracks?name=track2').expect(200);
    });
    it('Should fail to get track 3', async () => {
      await request(app).get('/tracks/3').expect(404);
    });
    it('Should fail to get track 4', async () => {
      await request(app).get('/tracks?name=track4').expect(404);
    });
    it('Server should fail because the id is not a number ', async () => {
      await request(app).get('/tracks/ñ').expect(500);
    });
    // it('Should fail to get track 3', async () => {
    //   await request(app).get('/tracks?name=track4~').expect(500);
    // });
  });

  describe('PATCH /tracks', () => {
    it ('Should successfully update track 1', async () => {
      await request(app).patch('/tracks/1').send({name: "track100"}).expect(200);
    });
    it ('Should successfully update track 2', async () => {
      await request(app).patch('/tracks?name=track2').send({name: "track200"}).expect(200);
    });
    it ('Should fail to update track 3', async () => {
      await request(app).patch('/tracks/3').send({name: "track300"}).expect(404);
    });
    it ('Should fail to update track 4', async () => {
      await request(app).patch('/tracks?name=track4').send({name: "track400"}).expect(404);
    });
    it ('Should fail to update without name', async () => {
      await request(app).patch('/tracks').send({name: "track400"}).expect(400);
    });
    it ('Should fail to update an atribute that not exist', async () => {
      await request(app).patch('/tracks').send({USERname: "track400"}).expect(400);
    });
    it ('Should fail to update without name', async () => {
      await request(app).patch('/tracks').send({users: [1001]}).expect(400);
    });
    it ('Should successfully update track100 to add a user', async () => {
      await request(app).patch('/tracks?name=track100').send({users: [1]}).expect(200);
    });

    

  });

  describe('DELETE /tracks', () => {
    it ('Should successfully delete track 1', async () => {
      await request(app).delete('/tracks/1').expect(200);
    });
    it ('Should successfully delete track 2', async () => {
      await request(app).delete('/tracks?name=track200').expect(200);
    });
    it ('Should fail to delete track 3', async () => {
      await request(app).delete('/tracks/3').expect(404);
    });
    it ('Should fail to delete track 4', async () => {
      await request(app).delete('/tracks?name=track4').expect(404);
    });
  });
});






