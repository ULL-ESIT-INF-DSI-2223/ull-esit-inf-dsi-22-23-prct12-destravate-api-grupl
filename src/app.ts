import express from 'express';
import './db/mongoose.js';



import { usersRouter } from './routers/users/users.js';
import { defaultRouter } from './routers/default.js';
import { trackRouter } from './routers/tracks/tracks.js';
import { challengesRouter } from './routers/challenges/challenges.js';
import { groupsRouter } from './routers/groups/groups.js';



export const app = express();
app.use(express.json());

app.use(usersRouter);
app.use(trackRouter);
app.use(challengesRouter);
app.use(groupsRouter);
app.use(defaultRouter);
