import express from 'express';
import { Note } from '../models/note.js';

export const noteRouter = express.Router();

noteRouter.post('/notes', (req, res) => {
  
  res.send("post");

  

});

noteRouter.get('/notes', (req, res) => {
  //const filter = req.query.title?{title: req.query.title.toString()}:{};

  res.send("get all");
});

