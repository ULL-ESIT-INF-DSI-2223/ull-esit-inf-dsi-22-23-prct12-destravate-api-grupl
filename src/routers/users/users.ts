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

import express from 'express';
import { Users } from '../../models/users.js';
import { GroupsModel} from '../../models/groups.js';
import { Track } from '../../models/tracks.js';
import { Challenges } from '../../models/challenges.js';
import { orderGroupRankingAndUpdate } from '../groups/groups.js';


export const usersRouter = express.Router();


/**
 * method to post a new user
 * @param {string} name - name of the user
 * @param {number} id - id of the user
 * @param {string} activities - activities of the user
 * @param {array} friends - friends of the user
 * @param {array} groups - groups of the user
 * @param {array} stats - stats of the user
 * @param {array} favRoutes - favourite routes of the user
 * @param {array} activeChallenges - active challenges of the user
 * @returns {object} - the user created
 * @throws {error} - if the user already exists
 * @throws {error} - if the friends of the user don't exist
 * @throws {error} - if the groups of the user don't exist
 * @throws {error} - if the favourite routes of the user don't exist
 * @throws {error} - if the challenges of the user don't exist
 * @throws {error} - if the user can't be saved
 * @throws {error} - if the user can't be added to the friends
 * @throws {error} - if the user can't be added to the groups
 * @throws {error} - if the user can't be added to the favourite routes
 * @throws {error} - if the user can't be added to the challenges
 * 
 */
usersRouter.post('/users', async (req, res) => {

  try {

      const arrayUsers = req.body.friends;
      const arrayIdFriendsUsers = [];
      
      for (let i = 0; i < arrayUsers.length; i++) {
        const user = await Users.findOne({id: arrayUsers[i]});
        if (!user) {
          return res.status(404).send({
            error: "User not found",
            user: user
          });
        }
        arrayIdFriendsUsers.push(user._id);
      }
    
      // check if the groups of the user exist
      const arrayGroups = req.body.groups;
      const arrayIdGroups = [];
    
      for (const group_ of arrayGroups) {
        const group = await GroupsModel.findOne({id: group_});
        if (!group) {
          return res.status(404).send({
            error: "Group not found",
            group: group
          });
        }
        arrayIdGroups.push(group._id);
      }


    
      // Check if the favourite routes of the user exist
      const arrayRoutes = req.body.favRoutes;
      const arrayIdRoutes = [];
    
      for (const route_ of arrayRoutes) {
        const route = await Track.findOne({id: route_});
        if (!route) {
          return res.status(404).send({
            error: "Route not found",
            route: route
          });
        }
        arrayIdRoutes.push(route._id);
      }

      // Check if the challenges of the user exist
      const arrayChallenges = req.body.activeChallenges;
      const arrayIdChallenges = [];
    
      for (const challenge_ of arrayChallenges) {
        const challenge = await Challenges.findOne({id: challenge_});
        if (!challenge) {
          return res.status(404).send({
            error: "Challenge not found",
            challenge: challenge
          });
        }
        arrayIdChallenges.push(challenge._id);
      }
  
      const user_ = new Users({
        ...req.body,
        friends: arrayIdFriendsUsers,
        groups: arrayIdGroups,
        favRoutes: arrayIdRoutes,
        activeChallenges: arrayIdChallenges
      });
    const userMessage = await user_.save();
    // Añadir el usuario a sus amigos
    for(const friend of user_.friends) {
      await Users.findOneAndUpdate({_id: friend}, {$push: {friends: user_._id}});
    }
    // Añadir el usuario de los grupos
    for (const group of user_.groups) {
      await GroupsModel.findOneAndUpdate({_id: group}, {$push: {participants: user_._id, ranking: user_.id}});
      await orderGroupRankingAndUpdate(group);
    }

    // Añadir de las rutas favoritas
    for (const route of user_.favRoutes) {
      await Track.findOneAndUpdate({_id: route}, {$push: {users: user_._id}});
    }

    // Añadir de los retos activos
    for (const challenge of user_.activeChallenges) {
      await Challenges.findOneAndUpdate({_id: challenge}, {$push: {idUsersChallenge: user_._id}});
    }
    return res.status(201).send(userMessage);
  }
  catch(error) {
    return res.status(500).send(
      {
        error: error.message,
        stack: error.stack
      }
    );
  }
});

/**
 * method to get all users
 * @param {string} name - name of the user
 * @param {number} id - id of the user
 * @param {string} activities - activities of the user
 * @param {array} friends - friends of the user
 * @param {array} groups - groups of the user
 * @param {array} stats - stats of the user
 * @param {array} favRoutes - favourite routes of the user
 * @param {array} activeChallenges - active challenges of the user
 * @returns {array} - all users
 * @throws {error} - if the users can't be found
 * 
 * 
 */
usersRouter.get('/users', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  try{
    const user = await Users.findOne(filter).populate([
      {path: 'friends', select: ['name']},
      {path: 'groups', select: ['name']}, 
      {path: 'favRoutes', select: ['name']}, 
      {path: 'activeChallenges', select: ['name']}
    ]);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  }
  catch{
    res.status(500).send();
  }
});

/**
 * method to get all users
 * @param {string} name - name of the user
 * @param {number} id - id of the user
 * @param {string} activities - activities of the user
 * @param {array} friends - friends of the user
 * @param {array} groups - groups of the user
 * @param {array} stats - stats of the user
 * @param {array} favRoutes - favourite routes of the user
 * @param {array} activeChallenges - active challenges of the user
 * @returns {array} - all users
 * @throws {error} - if the users can't be found
 * 
 * 
 */
usersRouter.get('/users/:id', async(req, res) => {
  const filter = req.params.id?{id: Number(req.params.id)}:{};

  try{
    const user = await Users.find(filter).populate([
    {path: "friends", select: "name"}, 
    {path: "groups", select: "name"}, 
    {path: "favRoutes", select: "name"}, 
    {path: "activeChallenges", select: "name"}
    ]);
    if (user.length !== 0) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  }
  catch{
    res.status(500).send();
  }
});


/**
 * method to update a user
 * @param {string} name - name of the user
 * @param {number} id - id of the user
 * @param {string} activities - activities of the user
 * @param {array} friends - friends of the user
 * @param {array} groups - groups of the user
 * @param {array} stats - stats of the user
 * @param {array} favRoutes - favourite routes of the user
 * @param {array} activeChallenges - active challenges of the user
 * @returns {array} - all users
 * @throws {error} - if the users can't be found
 */
usersRouter.patch('/users', async(req, res) => {


  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'activities', 'friends', 'groups', 'stats', 'favRoutes', 'activeChallenges', 'historicRoutes'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {

      if (req.body.friends){
        const arrayUsers = [];
        for (const friend of req.body.friends) {
          const user = await Users.findOne({id: friend});
          if (!user) {
            return res.status(404).send({
              error: "User not found",
              user: user
            });
          }
          arrayUsers.push(user._id);
        }
        req.body.friends = arrayUsers;
      }

      if (req.body.groups){
        const arrayGroups = [];
        for (const group_ of req.body.groups) {
          const group = await GroupsModel.findOne({id: group_});
          if (!group) {
            return res.status(404).send({
              error: "Group not found",
              group: group
            });
          }
          arrayGroups.push(group._id);
        }
        req.body.groups = arrayGroups;
      }

      if(req.body.favRoutes){
        const arrayRoutes = [];
        for (const route_ of req.body.favRoutes) {
          const route = await Track.findOne({id: route_});
          if (!route) {
            return res.status(404).send({
              error: "Route not found",
              route: route
            });
          }
          arrayRoutes.push(route._id);
        }
        req.body.favRoutes = arrayRoutes;
      }

      if(req.body.activeChallenges){
        const arrayChallenges = [];
        for (const challenge_ of req.body.activeChallenges) {
          const challenge = await Challenges.findOne({id: challenge_});
          if (!challenge) {
            return res.status(404).send({
              error: "Challenge not found",
              challenge: challenge
            });
          }
          arrayChallenges.push(challenge._id);
        }
        req.body.activeChallenges = arrayChallenges;
      }   
      try{
        const user = await Users.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return res.status(405).send();
        } else {
          // Añadir el usuario a sus amigos
          if (req.body.friends){
            for(const friend of user.friends) {
              await Users.findOneAndUpdate({_id: friend}, {$push: {friends: user._id}});
            }
          }
          if (req.body.groups){
            // Añadir el usuario de los grupos
            for (const group of user.groups) {
              const group_object = await GroupsModel.findOne({_id: group});
              if (group_object !== null){
                if (!group_object.participants.includes(user._id)){
                  await GroupsModel.findOneAndUpdate({_id: group}, {$push: {participants: user._id, ranking: user.id}});
                }
              }
              
              await orderGroupRankingAndUpdate(group);
            }
          }

          // MODIFICADO
          if (req.body.stats){
            for (const group of user.groups) {
              await orderGroupRankingAndUpdate(group);
            }
          }

          if (req.body.favRoutes){
            // Añadir de las rutas favoritas
            for (const route of user.favRoutes) {
              await Track.findOneAndUpdate({_id: route}, {$push: {users: user._id}});
            }
          }
          if(req.body.activeChallenges){
            // Añadir de los retos activos
            for (const challenge of user.activeChallenges) {
              await Challenges.findOneAndUpdate({_id: challenge}, {$push: {idUsersChallenge: user._id}});
            }
          }
          return res.send(user);
        }
      }
      catch{
        return res.status(500).send();
      }
    }
  }
});    

/**
 * method to update a user
 * @param {string} name - name of the user
 * @param {number} id - id of the user
 * @param {string} activities - activities of the user
 * @param {array} friends - friends of the user
 * @param {array} groups - groups of the user
 * @param {array} stats - stats of the user
 * @param {array} favRoutes - favourite routes of the user
 * @param {array} activeChallenges - active challenges of the user
 * @returns {array} - all users
 * @throws {error} - if the users can't be found
 */
usersRouter.patch('/users/:id', async(req, res) => {


  if (!req.params.id) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'activities', 'friends', 'groups', 'stats', 'favRoutes', 'activeChallenges', 'historicRoutes'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
    actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {

      if (req.body.friends){
        const arrayUsers = [];
        for (const friend of req.body.friends) {
          const user = await Users.findOne({id: friend});
          if (!user) {
            return res.status(404).send({
              error: "User not found",
              user: user
            });
          }
          arrayUsers.push(user._id);
        }
        req.body.friends = arrayUsers;
      }

      if (req.body.groups){
        const arrayGroups = [];
        for (const group_ of req.body.groups) {
          const group = await GroupsModel.findOne({id: group_});
          if (!group) {
            return res.status(404).send({
              error: "Group not found",
              group: group
            });
          }
          arrayGroups.push(group._id);
        }
        req.body.groups = arrayGroups;
      }

      if(req.body.favRoutes){ 
        const arrayRoutes = [];
        for (const route_ of req.body.favRoutes) {
          const route = await Track.findOne({id: route_});
          if (!route) {
            return res.status(404).send({
              error: "Route not found",
              route: route
            });
          }
          arrayRoutes.push(route._id);
        }
        req.body.favRoutes = arrayRoutes;
      }

      if(req.body.activeChallenges){
        const arrayChallenges = [];
        for (const challenge_ of req.body.activeChallenges) {
          const challenge = await Challenges.findOne({id: challenge_});
          if (!challenge) {
            return res.status(404).send({
              error: "Challenge not found",
              challenge: challenge
            });
          }
          arrayChallenges.push(challenge._id);
        }
        req.body.activeChallenges = arrayChallenges;
      }   
      try{
        const user = await Users.findOneAndUpdate({id: req.params.id}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          return res.status(405).send();
        } else {
          // Añadir el usuario a sus amigos
          if (req.body.friends){
            for(const friend of user.friends) {
              await Users.findOneAndUpdate({_id: friend}, {$push: {friends: user._id}});
            }
          }
          if (req.body.groups){
            // Añadir el usuario de los grupos
            for (const group of user.groups) {
              const group_object = await GroupsModel.findOne({_id: group});
              if (group_object !== null){
                if (!group_object.participants.includes(user._id)){
                  await GroupsModel.findOneAndUpdate({_id: group}, {$push: {participants: user._id, ranking: user.id}});
                }
              }
            }
          }

          // MODIFICADO
          if (req.body.stats){
            for (const group of user.groups) {
              await orderGroupRankingAndUpdate(group);
            }
          }
          if (req.body.favRoutes){
            // Añadir de las rutas favoritas
            for (const route of user.favRoutes) {
              await Track.findOneAndUpdate({_id: route}, {$push: {users: user._id}});
            }
          }
          if(req.body.activeChallenges){
            // Añadir de los retos activos
            for (const challenge of user.activeChallenges) {
              await Challenges.findOneAndUpdate({_id: challenge}, {$push: {idUsersChallenge: user._id}});
            }
          }
          return res.send(user);
        }
      }
      catch{
        return res.status(500).send();
      }
    }
  }
});    

/**
 * method to delete a user
 * @param {string} name - name of the user
 * @param {number} id - id of the user
 * @param {string} activities - activities of the user
 * @param {array} friends - friends of the user
 * @param {array} groups - groups of the user
 * @param {array} stats - stats of the user
 * @param {array} favRoutes - favourite routes of the user
 * @param {array} activeChallenges - active challenges of the user
 * @returns {array} - all users
 */
usersRouter.delete('/users/', async(req, res) => {

  const filter = req.query.name?{name: req.query.name.toString()}:{};
  
  try{ 
    const user = await Users.findOne(filter);
    if (!user) {
      return res.status(404).send();
    } 
    
    // ELiminar de los amigos
    for (const friend of user.friends) {
      await Users.findOneAndUpdate({_id: friend}, {$pull: {friends: user._id}});
    } 
    
    // Eliminar el usuario de los grupos
    for (const group of user.groups) {
      await GroupsModel.findOneAndUpdate({ _id: group }, { $pull: { participants: user._id, ranking: user.id } }
      );
      await orderGroupRankingAndUpdate(group);
    }

    // Eliminar de las rutas favoritas
    for (const route of user.favRoutes) {
      await Track.findOneAndUpdate({_id: route}, {$pull: {users: user._id}});
    }

    // Eliminar de los retos activos
    for (const challenge of user.activeChallenges) {
      await Challenges.findOneAndUpdate({_id: challenge}, {$pull: {idUsersChallenge: user._id}});
    }

    //await user.deleteOne();
    await Users.findOneAndDelete(filter);
    
    return res.send(user);
    
  }
  catch(error){
    return res.status(500).send(error);
  }
});

/**
 * method to delete a user
 * @param {string} name - name of the user
 * @param {number} id - id of the user
 * @param {string} activities - activities of the user
 * @param {array} friends - friends of the user
 * @param {array} groups - groups of the user
 * @param {array} stats - stats of the user
 * @param {array} favRoutes - favourite routes of the user
 * @param {array} activeChallenges - active challenges of the user
 * @returns {array} - all users
 */
usersRouter.delete('/users/:id', async(req, res) => {

  const filter = req.params.id?{id: req.params.id}:{};
  
  try{ 
    const user = await Users.findOne(filter);
    if (!user) {
      return res.status(404).send();
    } 
    
    // ELiminar de los amigos
    for (const friend of user.friends) {
      await Users.findOneAndUpdate({_id: friend}, {$pull: {friends: user._id}});
    } 
    
    // Eliminar el usuario de los grupos
    for (const group of user.groups) {
      await GroupsModel.findOneAndUpdate({_id: group}, {$pull: {participants: user._id, ranking: user.id}});
    }

    // Eliminar de las rutas favoritas
    for (const route of user.favRoutes) {
      await Track.findOneAndUpdate({_id: route}, {$pull: {users: user._id}});
    }

    // Eliminar de los retos activos
    for (const challenge of user.activeChallenges) {
      await Challenges.findOneAndUpdate({_id: challenge}, {$pull: {idUsersChallenge: user._id}});
    }

    //await user.deleteOne();
    await Users.findOneAndDelete(filter);
    
    return res.send(user);
    
  }
  catch(error){
    return res.status(500).send(error);
  }
});



