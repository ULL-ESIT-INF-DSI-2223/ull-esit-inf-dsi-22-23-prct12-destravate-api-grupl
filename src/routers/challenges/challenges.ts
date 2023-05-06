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



export const challengesRouter = express.Router();

challengesRouter.post('/challenges', async (req, res) => {

  try {

    const arrayUsers = req.body.idUsersChallenge;
    const arrayIdUsers = [];
    
    for (let i = 0; i < arrayUsers.length; i++) {
      const user = await Users.findOne({id: arrayUsers[i]});
      if (!user) {
      return res.status(404).send({
        error: "User not found"
      });
      }
      arrayIdUsers.push(user._id);
    }

    
    
    const challengeNew= new Challenges({
      ...req.body
    });

    challengeNew.idUsersChallenge = arrayIdUsers;
    await challengeNew.save();
    return res.status(201).send(challengeNew);
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

challengesRouter.get('/challenges', async(req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  try{
    const challenge = await Challenges.find(filter);
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
    const challenge = await Challenges.find(filter);
    if (!challenge) {
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
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'ruteChallenge', 'typeActivitie', 'kmTotal', 'idUsersChallenge'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try{
        const challenge = await Challenges.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!challenge) {
          res.status(405).send();
        } else {
          res.send(challenge);
        }
      }
      catch{
        res.status(500).send();
      }
    }
  }
});     

challengesRouter.delete('/challenges', async(req, res) => {


  const filter = req.query.name?{name: req.query.name.toString()}:{};
  
  // try{ 
  //   const challenge = Challenges.findOneAndDelete(filter);
  //   if (!challenge) {
  //     return res.status(404).send();
  //   } 
    
  //   return res.send(challenge);
    
  // }
  // catch(error){
  //   return res.status(500).send(error);
  // }

  try {
    const challenge = await Challenges.findOne(filter);
    if (!challenge) {
      return res.status(404).send("Challenge not found");
    } 
    const dbUsers = await Users.find({ activeChallenges : { $all : [challenge._id] }});
    return res.status(201).send(dbUsers);


    //const arrayIdUsers = [];
    
    // for (let i = 0; i < arrayUsers.length; i++) {
    //   const user = await Users.findOne({id: arrayUsers[i]});
    //   if (!user) {
    //   return res.status(404).send({
    //     error: "User not found"
    //   });
    //   }
    //   arrayIdUsers.push(user._id);
    // }
  } catch (error) {
      //
  }



});