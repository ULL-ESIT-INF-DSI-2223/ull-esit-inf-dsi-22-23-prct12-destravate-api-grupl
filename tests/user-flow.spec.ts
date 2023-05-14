
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
import { Track } from '../src/models/tracks.js';
import { Users } from '../src/models/users.js';
import { GroupsModel } from '../src/models/groups.js';
import { expect } from 'chai';
import { Challenges } from '../src/models/challenges.js';

describe('User flow', () => {
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
  
  
  const user3 = {
    id: 3,
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
    participants: [0],
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
    historicRoutes: []
  }
  const group3 = {
    id: 3,
    name: "grupo3",
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
    users: [0],
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
    idUsersChallenge: [0]
  };

  const challenge2 = {
    id: 2,
    name: "challenge2",
    ruteChallenge: [],
    typeActivities: "bicicleta",
    kmTotal: 20,
    idUsersChallenge: []
  };
  const challenge3 = {
    id: 3,
    name: "challenge3",
    ruteChallenge: [],
    typeActivities: "bicicleta",
    kmTotal: 20,
    idUsersChallenge: []
  };
  const challenge4 = {
    id: 4,
    name: "challenge4",
    ruteChallenge: [],
    typeActivities: "bicicleta",
    kmTotal: 20,
    idUsersChallenge: []
  };
  
  before(async () => {
    await Users.deleteMany();
    await GroupsModel.deleteMany();
    await Track.deleteMany();
    await Challenges.deleteMany();
    // await new Users(user).save();
    // await new GroupsModel(group1).save();
    // await new Challenges(challenge1).save();
    // await new Track(track1).save();

  }); 
  

  it('The user creates its user', async () => {
    const response = await request(app).post('/users').send(user0).expect(201);
    expect(response.body.id).to.eql(user0.id);
    expect(response.body.name).to.eql(user0.name);
    expect(response.body.activities).to.eql(user0.activities);
  });

  it('The user adds a new group with him in it', async () => {


    const group_ = await request(app).post('/groups').send(group1).expect(201);
    const user = await Users.findOne({id: 0});
    const group = await GroupsModel.findOne({id: 1});

    if (user && group) {
      expect(user.groups).to.eql([group._id]);
    }
    if (group && user) {
      expect(group.participants).to.eql([user._id]);
    }
    
  });

  it('The user adds a new track', async () => {
    const track_ = await request(app).post('/tracks').send(track1).expect(201);
    const user = await Users.findOne({id: 0});
    const track = await Track.findOne({id: 1});
    if (user && track) {
      expect(user.favRoutes).to.eql([track._id]);
    }
    if (track && user) {
      expect(track.users).to.eql([user._id]);
    }
    
  });

  it('The user adds a new challenge', async () => {
    const challenge_ = await request(app).post('/challenges').send(challenge1).expect(201);
    const user = await Users.findOne({id: 0});
    const challenge = await Challenges.findOne({id: 1});

    if (user && challenge) {
      expect(user.activeChallenges).to.eql([challenge._id]);
    }
    if (challenge && user) {
      expect(challenge.idUsersChallenge).to.eql([user._id]);
    }

  });

  it('The user adds a new group and then make a patch', async () => {
    const group_ = await request(app).post('/groups').send(group2).expect(201);
 
    const user_ = await request(app).patch('/users/0').send({groups: [2]}).expect(200);
    const group2_ = await GroupsModel.findOne({id: 2});
    const user = await Users.findOne({id: 0});
    if(user && group2_){
      expect(user.groups).to.eql([group2_._id]);
        
      expect(group2_.participants).to.eql([user._id]);
    }
  
  });

  it('The user adds a track to a new challenge', async () => {
    const challenge1_ = await request(app).patch('/challenges/1').send({ruteChallenge: [1]}).expect(200);
    const track1_ = await Track.findOne({id: 1});
    const challenge1 = await Challenges.findOne({id: 1});
    if(track1_ && challenge1){
      expect(challenge1.ruteChallenge).to.eql([track1_._id]);
    }

  } );

  it('The user delete a challenge, a track and group', async () => {

    const challenge1_ = await request(app).delete('/challenges/1').expect(200);
    const track1_ = await request(app).delete('/tracks/1').expect(200);
    const group2_ = await request(app).delete('/groups/2').expect(200);

    const user = await Users.findOne({id: 0});

    if (user) {
      expect(user.activeChallenges).to.eql([]);
      expect( user.favRoutes).to.eql([]);
      expect( user.groups).to.eql([]);
    }
  });

  it('The user delete it self', async () => {
      
      const user_ = await request(app).delete('/users/0').expect(200);
  
      const user = await Users.findOne({id: 0});
  
      if (user) {
        expect(user).to.eql(null);
      }
  });
    
});