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
import { Challenges } from '../src/models/challenges.js';
import { Users } from '../src/models/users.js';
import { Track } from '../src/models/tracks.js';
import { expect } from 'chai';




describe('Challenges', () => {

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

  const challenge3 = {
    id: 3,
    name: "challenge3",
    ruteChallenge: [100],
    typeActivities: "correr",
    kmTotal: 20,
    idUsersChallenge: []
  };

  const challenge4 = {
    id: 4,
    name: "challenge4",
    ruteChallenge: [1],
    typeActivities: "correr",
    kmTotal: 20,
    idUsersChallenge: [1]
  };

  const challenge5 = {
    id: 5,
    name: "challenge5",
    ruteChallenge: [],
    typeActivities: "correr",
    kmTotal: 20,
    idUsersChallenge: [45432]
  };

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

  const user2 = {
    id: 2,
    name: "ismas",
    activities: "correr",
    friends: [],
    groups: [],
    stats: [[0, 0], [0, 0], [0, 0]],
    favRoutes:[],
    activeChallenges: []
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
  


  before(async () => {
    await Challenges.deleteMany();
    await Users.deleteMany();
    await new Users(user).save();
    await new Users(user2).save();
    await Track.deleteMany();
    await new Track(track1).save();
  });

  describe('POST /challenges', () => {
    it('Should create a challenge successfully', async () => {
      await request(app).post('/challenges').send(challenge1).expect(201);
    });
    it('Should create a challenge successfully', async () => {
      await request(app).post('/challenges').send(challenge4).expect(201);
    });
    it('Should return 500 if the challenge exists', async () => {
      await request(app).post('/challenges').send(challenge1).expect(500);
    });
    it('Should return 500 if the challenge exists', async () => {
      await request(app).post('/challenges').send(challenge3).expect(404);
    });
    it('Should return 500 if the challenge exists', async () => {
      await request(app).post('/challenges').send(challenge5).expect(404);
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
    it('Challenge does not existe should return 404', async () => {
      await request(app).get('/challenges/100').send().expect(404);
    });
    it('Challenge does not existe should return 404', async () => {
      await request(app).get('/challenges/ñ').send().expect(500);
    });
  });

  describe('PATCH /challenges', () => {
    it('Should modify a challenge name by its id successfully', async () => {
      await request(app).patch('/challenges/1').send({name: "challenge1modificado"}).expect(200);
    });
    it('Should modify a challenge name by its name successfully', async () => {
      await request(app).patch('/challenges?name=challenge1modificado').send({name: "challenge1modificado2"}).expect(200);
    });
    it('Should modify a challenge name by its name fail', async () => {
      await request(app).patch('/challenges?name=challenge1modificado').send({Username: "challenge1modificado2"}).expect(400);
    });
    it('Challenge does not exist should return 404', async () => {
      await request(app).patch('/challenges?name=challenge2').send({name: "challenge2modificado"}).expect(404);
    });

    it('Challegen should allow to update adding a user that exists', async () => {
      await request(app).patch('/challenges?name=challenge1modificado2').send({idUsersChallenge: [1]}).expect(200);
    });
    
    it('Challenge should fail adding a user that not exists', async () => {
      await request(app).patch('/challenges?name=challenge1modificado2').send({idUsersChallenge: [100]}).expect(404);
    });

    it('Challegen should allow to update adding a route that exists', async () => {
      await request(app).patch('/challenges?name=challenge1modificado2').send({ruteChallenge: [1]}).expect(200);
    });
    
    it('Challenge should fail adding a that not exists', async () => {
      await request(app).patch('/challenges?name=challenge1modificado2').send({ruteChallenge: [100]}).expect(404);
    });

    it('Challenge should fail an id must be provided', async () => {
      await request(app).patch('/challenges/').send({}).expect(400);
    });

    it('Challenge should fail trying to update an atribute that not exists', async () => {
      await request(app).patch('/challenges/1').send({rutaChallenge: [1]}).expect(400);
    });

    it('Challenge should fail an idUsersChallenge be provided', async () => {
      await request(app).patch('/challenges/4').send({idUsersChallenge: [444]}).expect(404);
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

});