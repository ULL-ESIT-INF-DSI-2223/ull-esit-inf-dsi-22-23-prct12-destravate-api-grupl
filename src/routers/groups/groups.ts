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

/** 
 * 
 * method to post a new group in the database 
 * - Check if the users exist
 * - Check if the routes exist
 * - Create the group
 * - Add the group to the users
 *
 * 
 * 
 * @param {string} name - Nombre del grupo
 * @param {string} participants - ID de los usuarios que pertenecen al grupo
 * @param {string} stats - Estadísticas del grupo
 * @param {string} ranking - Ranking del grupo
 * @param {string} favouriteRoutes - Rutas favoritas del grupo
 * @param {string} routesHistory - Historial de rutas del grupo
 * @returns {object} - Grupo creado
 * 
 * 
 */
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

/**
 * 
 * method to get all the groups in the database
 * - Check if the group exists
 * - Return the group
 * 
 * 
 * @param {string} name - Nombre del grupo
 * @param {string} participants - ID de los usuarios que pertenecen al grupo
 * @param {string} stats - Estadísticas del grupo
 * @param {string} ranking - Ranking del grupo
 * @param {string} favouriteRoutes - Rutas favoritas del grupo
 * @param {string} routesHistory - Historial de rutas del grupo
 * @returns {object} - Grupos
 * 
 */
groupsRouter.get('/groups', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const group = await GroupsModel.find(filter).populate([
      {path: 'participants', select: 'name'},
      {path: 'favouriteRoutes', select: 'name'}
      ]);
    if(group.length === 0) {
      return res.status(404).send(
        {"error": "Group not found"}
      );
    }
    return res.send(group);
  } catch (error) {
    return res.status(500).send(error);
  }


});

/**
 * 
 * method to get all the groups in the database
 * - Check if the group exists
 * - Return the group
 * 
 * 
 * @param {string} name - Nombre del grupo
 * @param {string} participants - ID de los usuarios que pertenecen al grupo
 * @param {string} stats - Estadísticas del grupo
 * @param {string} ranking - Ranking del grupo
 * @param {string} favouriteRoutes - Rutas favoritas del grupo
 * @param {string} routesHistory - Historial de rutas del grupo
 * @returns {object} - Grupos
 * 
 */
groupsRouter.get('/groups/:id', async (req, res) => {
  const filter = req.params.id?{id: req.params.id}:{};
  try {
    const group = await GroupsModel.find(filter).populate([{'path': 'participants', select: 'name'}, 
    {'path': 'favouriteRoutes', select: 'name'}]);
    if(group.length === 0) {
      return res.status(404).send(
        {"error": "Group not found"}
      );
    }
    return res.send(group);
  } catch (error) {
    return res.status(500).send(error);
  }

});


/**
 * method to update a group in the database
 * - Check if the group exists
 * - Check if the users exist
 * - Check if the routes exist
 * - Update the group
 * - Update the users
 * 
 * 
 */
groupsRouter.patch('/groups', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({error: "No name provided"});
  } else {
    const allowedUpdates = ['id', 'name', 'participants', 'stats', 'ranking', 'favouriteRoutes', 'routesHistory']
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
    if (!isValidUpdate) {
      return res.status(400).send({error: "Invalid update"});
    } else {
      if (req.body.participants) {
        // Comprobar que los miebros del grupo existen
        const arrayParticipants = [];
        for (const user of req.body.participants) {
          const user_ = await Users.findOne({id: user});
          if(!user_) {
            return res.status(404).send(
              {"error": "User not found",
              "user": user});
          }
          arrayParticipants.push(user_._id);
        }
        req.body.participants = arrayParticipants;
      }
    // Comprobar que las rutas del grupo existen
      if (req.body.favouriteRoutes) {
        const arrayFavouriteRoutes = [];
        for (const route of req.body.favouriteRoutes) {
          const route_ = await Track.findOne({id: route});
          if(!route_) {
            return res.status(404).send(
              {"error": "Route not found",
              "route": route});
          }
          arrayFavouriteRoutes.push(route_._id);
        }
        req.body.favouriteRoutes = arrayFavouriteRoutes;
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
          return res.send(group);
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
  });

  /**
 * method to update a group in the database
 * - Check if the group exists
 * - Check if the users exist
 * - Check if the routes exist
 * - Update the group
 * - Update the users
 * 
 * 
 */
  groupsRouter.patch('/groups/:id', async (req, res) => {
    if (!req.params.id) {
      return res.status(400).send({error: "No id provided"});
    } else {
      const allowedUpdates = ['id', 'name', 'participants', 'stats', 'ranking', 'favouriteRoutes', 'routesHistory']
      const actualUpdates = Object.keys(req.body);
      const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
      if (!isValidUpdate) {
        return res.status(400).send({error: "Invalid update"});
      } else {
        if (req.body.participants) {
          // Comprobar que los miebros del grupo existen
          const arrayParticipants = [];
          for (const user of req.body.participants) {
            const user_ = await Users.findOne({id: user});
            if(!user_) {
              return res.status(404).send(
                {"error": "User not found",
                "user": user});
            }
            arrayParticipants.push(user_._id);
          }
          req.body.participants = arrayParticipants;
        }

      // Comprobar que las rutas del grupo existen
        if (req.body.favouriteRoutes) {
          const arrayRoutes = [];
          for (const route of req.body.favouriteRoutes) {
            const route_ = await Track.findOne({id: route});
            if(!route_) {
              return res.status(404).send(
                {"error": "Route not found",
                "route": route});
            }
            arrayRoutes.push(route_._id);
          }
          req.body.favouriteRoutes = arrayRoutes;
        }
          try {
            const group = await GroupsModel.findOneAndUpdate({id: req.params.id }, req.body, {
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
            return res.send(group);
          } catch (error) {
            return res.status(500).send(error);
          }
        }
      }
    });

/**
 * method to delete a group in the database
 * - Check if the group exists
 * - Delete the group
 * - Delete the group from the users
 * 
 * 
 */
groupsRouter.delete('/groups', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const group_ = await GroupsModel.findOne(filter);
    if(!group_) {
      return res.status(404).send();
    }

    for (const user of group_.participants) {
      await Users.findOneAndUpdate({ _id: user }, { $pull: { groups: group_._id } });
    };

    const group = await GroupsModel.findOneAndDelete(filter);
    return res.send(group);
  } catch (error) {
     return res.status(500).send(error);
  }

});

/**
 * method to delete a group in the database
 * - Check if the group exists
 * - Delete the group
 * - Delete the group from the users
 * 
 */
groupsRouter.delete('/groups/:id', async (req, res) => {


  const filter = req.params.id?{id: req.params.id}:{};
  try {
    const group_ = await GroupsModel.findOne(filter);
    if(!group_) {
      return res.status(404).send();
    }

    for (const user of group_.participants) {
      await Users.findOneAndUpdate({ _id: user }, { $pull: { groups: group_._id } });
    };

    const group = await GroupsModel.findOneAndDelete(filter);
    return res.send(group);
  } catch (error) {
     return res.status(500).send(error);
  }


});
