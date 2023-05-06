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

export const usersRouter = express.Router();

usersRouter.post('/users', (req, res) => {

  

  const user = new Users(req.body);

  user.save().then((user) => {
    res.status(201).send(user);
  }).catch((error) => {
    res.status(400).send(error);
  });

});

usersRouter.get('/users', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  try{
    const user = await Users.find(filter);
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


usersRouter.get('/users/:id', async(req, res) => {
  const filter = req.params.id?{id: Number(req.params.id)}:{};
  try {
    const user = await Users.find(filter);
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }
  }
  catch{
    res.status(500).send();
  }
});




usersRouter.patch('/users', async(req, res) => {


  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'userName', 'activities', 'friends', 'groups', 'stats', 'favouriteRoutes', 'challenges', 'historic'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      try{
        const user = await Users.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
          new: true,
          runValidators: true,
        });
        if (!user) {
          res.status(405).send();
        } else {
          res.send(user);
        }
      }
      catch{
        res.status(500).send();
      }
    }
  }
});    

usersRouter.delete('/users/', async(req, res) => {

  const filter = req.query.name?{name: req.query.name.toString()}:{};
  
  try{ 
    const user = await Users.findOneAndDelete(filter);
    if (!user) {
      return res.status(404).send();
    } 
    
    return res.send(user);
    
  }
  catch(error){
    return res.status(500).send(error);
  }
});


