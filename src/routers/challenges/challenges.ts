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
import { Challenges } from '../../models/challenges.js';
import { Users } from '../../models/users.js';
import { Track } from '../../models/tracks.js';



export const challengesRouter = express.Router();

challengesRouter.post('/challenges', async (req, res) => {

  try {

    const arrayUsers = req.body.idUsersChallenge;
    const arrayIdUsers = [];
    for (const user_ of arrayUsers) {
      const user = await Users.findOne({id: user_});
      if (!user) {
      return res.status(404).send({
        error: "User not found"
      });
      }
      arrayIdUsers.push(user._id);
    }

    const arrayRoutes = req.body.ruteChallenge;
    const arrayIdRoutes = [];

    for (const route of arrayRoutes) {
      const routeDB = await Track.findOne({id: route});
      if (!routeDB) {
        return res.status(404).send({
          error: "Route not found"

        });
      }
      arrayIdRoutes.push(routeDB._id);
    }

    const challengeNew= new Challenges({
      ...req.body,
      idUsersChallenge: arrayIdUsers,
      ruteChallenge: arrayIdRoutes
    });

    await challengeNew.save();

    for (const user of arrayIdUsers) {
      await Users.findOneAndUpdate({ _id: user }, { $push: { activeChallenges: challengeNew._id } });
    }

    return res.status(201).send(challengeNew);
    
  } catch (error) {
    return res.status(500).send(error);
  }
  
});

challengesRouter.get('/challenges', async(req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  try{
    const challenge = await Challenges.find(filter).populate([
      { path: 'idUsersChallenge', select: 'id name' },
      { path: 'ruteChallenge', select: 'id name' }
    ]);
    if (challenge.length !== 0) {
      res.send(challenge);
    } else {
      res.status(404).send();
    }
  }
  catch{
    res.status(500).send();
  }
});

challengesRouter.get('/challenges/:id', async(req, res) => {
  const filter = req.params.id?{id: Number(req.params.id)}:{};
  try {
    const challenge = await Challenges.find(filter).populate([
      { path: 'idUsersChallenge', select: 'id name' },
      { path: 'ruteChallenge', select: 'id name' }
    ]);
    if (challenge.length === 0) {
      res.status(404).send();
    } else {
      res.send(challenge);
    }
  }
  catch{
    res.status(500).send();
  }
});


challengesRouter.patch('/challenges', async(req, res) => {


  if (!req.query.name) {
    return res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'ruteChallenge', 'typeActivitie', 'kmTotal', 'idUsersChallenge'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));
 
    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      if (req.body.idUsersChallenge) {
        const arrayUsers = [];
        for (const user of req.body.idUsersChallenge) {
          const userDB = await Users.findOne({id: user});
          if (!userDB) {
            return res.status(404).send({
              error: "User not found"
            });
          }
          arrayUsers.push(userDB._id);
        }
        req.body.idUsersChallenge = arrayUsers;
      }
      if (req.body.ruteChallenge) {
        const arrayRoutes = [];
        for (const route of req.body.ruteChallenge) {
          const routeDB = await Track.findOne({id: route});
          if (!routeDB) {
            return res.status(404).send({
              error: "Route not found"
            });
          }
          arrayRoutes.push(routeDB._id);
        }
        req.body.ruteChallenge = arrayRoutes;
      }         
      try{
        const challenge = await Challenges.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!challenge) {
          return res.status(404).send();
        } else {
          if (req.body.idUsersChallenge) {
            for (const user of req.body.idUsersChallenge) {
              await Users.findOneAndUpdate({ _id: user }, { $push: { activeChallenges: challenge._id } });
            }
          }
          if (req.body.ruteChallenge) {
            for (const route of req.body.ruteChallenge) {
              await Track.findOneAndUpdate({ _id: route }, { $push: { idChallenges: challenge._id } });
            }
          }
          return res.send(challenge);
        }
      } catch{
        return res.status(500).send();
      }
    }
  } 
});     

challengesRouter.patch('/challenges/:id', async(req, res) => {


  if (!req.params.id) {
    return res.status(400).send({
      error: 'An id must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'ruteChallenge', 'typeActivitie', 'kmTotal', 'idUsersChallenge'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));
 
    if (!isValidUpdate) {
      return res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      if (req.body.idUsersChallenge) {
        for (const user of req.body.idUsersChallenge) {
          const userDB = await Users.findOne({id: user});
          if (!userDB) {
            return res.status(404).send({
              error: "User not found"
            });
          }
        }
      }
      if (req.body.ruteChallenge) {
        for (const route of req.body.ruteChallenge) {
          const routeDB = await Track.findOne({id: route});
          if (!routeDB) {
            return res.status(404).send({
              error: "Route not found"
            });
          }
        }
      }         
      try{
        const challenge = await Challenges.findOneAndUpdate({id: req.params.id}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!challenge) {
          return res.status(404).send();
        } else {
          if (req.body.idUsersChallenge) {
            for (const user of req.body.idUsersChallenge) {
              await Users.findOneAndUpdate({ _id: user }, { $push: { activeChallenges: challenge._id } });
            }
          }
          if (req.body.ruteChallenge) {
            for (const route of req.body.ruteChallenge) {
              await Track.findOneAndUpdate({ _id: route }, { $push: { idChallenges: challenge._id } });
            }
          }
          return res.send(challenge);
        }
      } catch{
        return res.status(500).send();
      }
    }
  } 
});     

challengesRouter.delete('/challenges', async(req, res) => {


  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try{ 
    const challenge = await Challenges.findOne(filter);
    if (!challenge) {
      return res.status(404).send();
    } 
    
    // Eliminar el usuarios del reto
    for (const user of challenge.idUsersChallenge) {
      await Users.findOneAndUpdate({_id: user}, {$pull: {activeChallenges: challenge._id}});
    }

    //await user.deleteOne();
    await Challenges.findOneAndDelete(filter);
    
    return res.send(challenge);
    
  }
  catch(error){
    return res.status(500).send(error);
  }


});

challengesRouter.delete('/challenges/:id', async(req, res) => {


  const filter = req.params.id?{id: req.params.id}:{};

  try{ 
    const challenge = await Challenges.findOne(filter);
    if (!challenge) {
      return res.status(404).send();
    } 
    
    // Eliminar el usuarios del reto
    for (const user of challenge.idUsersChallenge) {
      await Users.findOneAndUpdate({_id: user}, {$pull: {activeChallenges: challenge._id}});
    }

    //await user.deleteOne();
    await Challenges.findOneAndDelete(filter);
    
    return res.send(challenge);
    
  }
  catch(error){
    return res.status(500).send(error);
  }


});