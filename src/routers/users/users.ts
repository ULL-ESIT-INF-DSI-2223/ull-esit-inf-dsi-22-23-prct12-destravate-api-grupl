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

usersRouter.get('/users', (req, res) => {
  //const filter = req.query.title?{title: req.query.title.toString()}:{};

  res.send("get all");
});

