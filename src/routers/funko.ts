import express from 'express';
import { Note } from '../models/note.js';

export const funkoRouter = express.Router();

funkoRouter.post('/funko', (req, res) => {
  
  res.send("post");

  

});

funkoRouter.get('/funko', (req, res) => {
  //const filter = req.query.title?{title: req.query.title.toString()}:{};

  res.send("get all funko");
});

