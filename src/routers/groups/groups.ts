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
import { GroupsModel } from '../../models/groups.js';

export const groupsRouter = express.Router();


groupsRouter.post('/groups', async (req, res) => {
  const group = new GroupsModel(req.body);

  try {
    const group_ = await group.save();
    return res.status(201).send(group_);
  } catch (error) {
    return res.status(500).send(error);
  }

});

groupsRouter.get('/groups', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const group = await GroupsModel.find(filter);
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }


});

groupsRouter.get('/groups/:id', async (req, res) => {
  const filter = {id: Number(req.params.id)};
  
  try {
    const group = await GroupsModel.find(filter);
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }

});

groupsRouter.delete('/groups', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const group = await GroupsModel.findOneAndDelete(filter);
    if (!group) {
      return res.status(404).send();
    }
    return res.status(201).send(group);
  } catch (error) {
     return res.status(500).send(error);
  }

});

groupsRouter.delete('/groups/:id', async (req, res) => {

  const filter = { id: Number(req.query.id)};

  try {
    const group = await GroupsModel.findOneAndDelete(filter);
    if (!group) {
      return res.status(404).send();
    }
    return res.status(201).send(group);
  } catch (error) {
     return res.status(500).send(error);
  }

});

groupsRouter.patch('/groups', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({error: "No name provided"});
  } else {
    const allowedUpdates = ['name', 'participants', 'stats', 'ranking', 'favouriteRoutes', 'routesHistory']
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
    if (!isValidUpdate) {
      return res.status(400).send({error: "Invalid update"});
    } else {
        try {
          const group = await GroupsModel.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
            new: true, 
            runValidators: true});
          if (!group) {
            return res.status(404).send();
          }
          return res.status(201).send(group);
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
  });

  groupsRouter.patch('/groups/:id', async (req, res) => {
    if (!req.query.name) {
      return res.status(400).send({error: "No name provided"});
    } else {
      const allowedUpdates = ['name', 'participants', 'stats', 'ranking', 'favouriteRoutes', 'routesHistory']
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
      if (!isValidUpdate) {
        return res.status(400).send({error: "Invalid update"});
      } else {
          try {
            const group = await GroupsModel.findOneAndUpdate({id: Number(req.params.id)}, req.body, {
              new: true, 
              runValidators: true});
            if (!group) {
              return res.status(404).send();
            }
            return res.status(201).send(group);
          } catch (error) {
            return res.status(500).send(error);
          }
        }
      }
    });