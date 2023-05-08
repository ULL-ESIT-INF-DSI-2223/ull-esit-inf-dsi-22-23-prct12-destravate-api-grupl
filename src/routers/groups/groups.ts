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
import { Users } from '../../models/users.js';
import { Track } from '../../models/tracks.js';

export const groupsRouter = express.Router();


groupsRouter.post('/groups', async (req, res) => {
  
  try {
    // Comprobar que los miebros del grupo existen
    const arrayIDUsers = [];
    for (const user of req.body.participants) {
      const user_ = await Users.findOne({id: user});
      if(!user_) {
        return res.status(404).send(
          {"error": "User not found",
          "user": user});
      }
      arrayIDUsers.push(user_._id);
    }
    // Comprobar que las rutas del grupo existen
    const arrayIDRoutes = [];
    for (const route of req.body.favouriteRoutes) {
      const route_ = await Track.findOne({id: route});
      if(!route_) {
        return res.status(404).send(
          {"error": "Route not found",
          "route": route});
      }
      arrayIDRoutes.push(route_._id);
    }
    
    
    const group_ = new GroupsModel({
      ...req.body,
      participants: arrayIDUsers,
      favouriteRoutes: arrayIDRoutes
    });

  
    await group_.save();

    for (const user of arrayIDUsers) {
      await Users.findOneAndUpdate({ _id: user }, { $push: { groups: group_._id} });
    }
    
    return res.status(201).send(group_);
  } catch (error) {
    return res.status(500).send(error);
  }

});

groupsRouter.get('/groups', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const group = await GroupsModel.find(filter).populate([
      {path: 'participants', select: 'id name'},
      {path: 'favouriteRoutes', select: 'id name'}
      ]);
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }


});

groupsRouter.get('/groups/:id', async (req, res) => {
  const filter = {id: Number(req.params.id)};
  
  try {
    const group = await GroupsModel.find(filter).populate([
      {path: 'participants', select: 'id name'},
      {path: 'favouriteRoutes', select: 'id name'}
      ]);
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send(error);
  }

});

groupsRouter.delete('/groups', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};


  try {
    const group_ = await GroupsModel.findOne(filter);
    if(!group_) {
      return res.status(404).send();
    }

    for (const user of req.body.participants) {
      await Users.findOneAndUpdate({ _id: user }, { $pull: { groups: group_._id } });
    };

    const group = await GroupsModel.findOneAndDelete(filter);
    return res.status(201).send(group);
  } catch (error) {
     return res.status(500).send(error);
  }

});

groupsRouter.delete('/groups/:id', async (req, res) => {

  const filter = { id: Number(req.query.id)};


  try {
    const group_ = await GroupsModel.findOne(filter);
    if(!group_) {
      return res.status(404).send();
    }

    for (const user of req.body.participants) {
      await Users.findOneAndUpdate({ _id: user }, { $pull: { groups: group_._id } });
    };

    const group = await GroupsModel.findOneAndDelete(filter);
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
      if (req.body.participants) {
        // Comprobar que los miebros del grupo existen
        for (const user of req.body.participants) {
          const user_ = await Users.findOne({id: user});
          if(!user_) {
            return res.status(404).send(
              {"error": "User not found",
              "user": user});
          }
        }
      }
    // Comprobar que las rutas del grupo existen
      if (req.body.favouriteRoutes) {
        for (const route of req.body.favouriteRoutes) {
          const route_ = await Track.findOne({id: route});
          if(!route_) {
            return res.status(404).send(
              {"error": "Route not found",
              "route": route});
          }
        }
      }
        try {
          const group = await GroupsModel.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
            new: true, 
            runValidators: true});
          if (!group) {
            return res.status(404).send();

          }
          if (req.body.participants) {
            for (const user of req.body.participants) {
              await Users.findOneAndUpdate({ _id: user }, { $push: { groups: group._id } });
            }
          }
          return res.status(201).send(group);
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
  });

  groupsRouter.patch('/groups/:id', async (req, res) => {
    if (!req.params.id) {
      return res.status(400).send({error: "No id provided"});
    } else {
      const allowedUpdates = ['name', 'participants', 'stats', 'ranking', 'favouriteRoutes', 'routesHistory']
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
      if (!isValidUpdate) {
        return res.status(400).send({error: "Invalid update"});
      } else {
        if (req.body.participants) {
          // Comprobar que los miebros del grupo existen
          for (const user of req.body.participants) {
            const user_ = await Users.findOne({id: user});
            if(!user_) {
              return res.status(404).send(
                {"error": "User not found",
                "user": user});
            }
          }
        }
      // Comprobar que las rutas del grupo existen
        if (req.body.favouriteRoutes) {
          for (const route of req.body.favouriteRoutes) {
            const route_ = await Track.findOne({id: route});
            if(!route_) {
              return res.status(404).send(
                {"error": "Route not found",
                "route": route});
            }
          }
        }
          try {
            const group = await GroupsModel.findByIdAndUpdate({_id: req.params.id }, req.body, {
              new: true, 
              runValidators: true});
            if (!group) {
              return res.status(404).send();
  
            }
            if (req.body.participants) {
              for (const user of req.body.participants) {
                await Users.findOneAndUpdate({ _id: user }, { $push: { groups: group._id } });
              }
            }
            return res.status(201).send(group);
          } catch (error) {
            return res.status(500).send(error);
          }
        }
      }
    });