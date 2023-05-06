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
import {connect } from 'mongoose';

import { usersRouter } from './routers/users/users.js';
import { defaultRouter } from './routers/default.js';
import { trackRouter } from './routers/tracks/tracks.js';
import { challengesRouter } from './routers/challenges/challenges.js';
import { groupsRouter } from './routers/groups/groups.js';


connect('mongodb://127.0.0.1:27017/destravate').then(() => {
  console.log('Connection to MongoDB server established');
}).catch(() => {
  console.log('Unable to connect to MongoDB server');
});

const app = express();
app.use(express.json());

app.use(usersRouter);
app.use(trackRouter);
app.use(challengesRouter);
app.use(groupsRouter);
app.use(defaultRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});