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
import { Track } from '../../models/tracks.js'
import { Users } from '../../models/users.js'

export const trackRouter = express.Router();


/**
 * method to create a new track
 * 
 * 
 * @param {string} name - name of the track
 * @param {string} initialGeo - initial point of the track
 * @param {string} finalGeo - final point of the track
 * @param {number} kmLength - length of the track
 * @param {number} avegLevel - average level of the track
 * @param {array} users - users that have the track as a favourite
 * @param {string} activityType - type of activity of the track
 * @param {number} avegMark - average mark of the track
 * 
 * 
 * 
 */
trackRouter.post('/tracks', async (req, res) => {
    

  try {
    const arrayIDUsers = [];
    for (const user of req.body.users) {
      const user_ = await Users.findOne({id: user});
      if(!user_) {
        return res.status(404).send(
          {"error": "User not found",
          "user": user});
      }
      arrayIDUsers.push(user_._id);
    }

    
    const track = new Track({
      ...req.body,
      users: arrayIDUsers
    });

    for(const user of arrayIDUsers) {
      await Users.findOneAndUpdate({_id: user._id}, {$push: {favRoutes: track._id}});
      
    }
    
    const track_ = await track.save();
    return res.status(201).send(track_);
  } catch (error) {
    return res.status(500).send(error);
  }

});


/**
 * method to get all the tracks
 * - if the query name is provided, it will return the track with that name
 * - if the query id is provided, it will return the track with that id
 * 
 *
 * @param {string} name - name of the track
 * @param {string} initialGeo - initial point of the track
 * @param {string} finalGeo - final point of the track
 * @param {number} kmLength - length of the track
 * @param {number} avegLevel - average level of the track
 * @param {array} users - users that have the track as a favourite
 * @param {string} activityType - type of activity of the track
 * @param {number} avegMark - average mark of the track
 * 
 */

trackRouter.get('/tracks', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const track = await Track.find(filter).populate(
      {path: 'users', select: ['name']} 
    );
    if (track.length === 0) {
      return res.status(404).send();
    }
    return res.status(200).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }


});


/**
 * method to get all the tracks
 * - if the query name is provided, it will return the track with that name
 * - if the query id is provided, it will return the track with that id
 * 
 *
 * @param {string} name - name of the track
 * @param {string} initialGeo - initial point of the track
 * @param {string} finalGeo - final point of the track
 * @param {number} kmLength - length of the track
 * @param {number} avegLevel - average level of the track
 * @param {array} users - users that have the track as a favourite
 * @param {string} activityType - type of activity of the track
 * @param {number} avegMark - average mark of the track
 * 
 */
trackRouter.get('/tracks/:id', async (req, res) => {
  const filter = {id: Number(req.params.id)};
  
  try {
    const track = await Track.find(filter).populate(
      {path: 'users', select: ['name']} 
    );
    if (track.length === 0) {
      return res.status(404).send();
    }
    return res.status(200).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }


});


/** 
 * method to update a track
 * - if the query name is provided, it will update the track with that name
 * - if the query id is provided, it will update the track with that id
 * 
 * 
 * @param {string} name - name of the track
 * @param {string} initialGeo - initial point of the track
 * @param {string} finalGeo - final point of the track
 * @param {number} kmLength - length of the track
 * @param {number} avegLevel - average level of the track
 * @param {array} users - users that have the track as a favourite
 * @param {string} activityType - type of activity of the track
 * @param {number} avegMark - average mark of the track
 * 
 */
trackRouter.patch('/tracks', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({error: "No name provided"});
  } else {
    const allowedUpdates = ['id', 'name', 'initialGeo', 'finalGeo', 'kmLength', 'avegLevel', 'users', 'activityType', 'avegMark'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
    if (!isValidUpdate) {
      return res.status(400).send({error: "Invalid update"});
    } else {
      
      if (req.body.users){
        const arrayUsers = [];
        for (const user_ of req.body.users) {
          const user = await Users.findOne({id: user_});
          if (!user) {
            return res.status(404).send({
              error: "User not found",
              user: user
            });
          }
          arrayUsers.push(user._id);
        }
        req.body.users = arrayUsers;
      }

        try {
          const track = await Track.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
            new: true, 
            runValidators: true});
          if (!track) {
            return res.status(404).send();
          }
          if (req.body.users){
            for(const friend of track.users) {
              await Users.findOneAndUpdate({_id: friend}, {$push: {favRoutes: track._id}});
            }
          }
          return res.send(track);
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
  });

  /** 
 * method to update a track
 * - if the query name is provided, it will update the track with that name
 * - if the query id is provided, it will update the track with that id
 * 
 * 
 * @param {string} name - name of the track
 * @param {string} initialGeo - initial point of the track
 * @param {string} finalGeo - final point of the track
 * @param {number} kmLength - length of the track
 * @param {number} avegLevel - average level of the track
 * @param {array} users - users that have the track as a favourite
 * @param {string} activityType - type of activity of the track
 * @param {number} avegMark - average mark of the track
 * 
 */
  trackRouter.patch('/tracks/:id', async (req, res) => {
    const allowedUpdates = ['id', 'name', 'initialGeo', 'finalGeo', 'kmLength', 'avegLevel', 'users', 'activityType', 'avegMark'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
    if (!isValidUpdate) {
      return res.status(400).send({error: "Invalid update"});
    } else {
        
      if (req.body.users){
        const arrayUsers = [];
        for (const user_ of req.body.users) {
          const user = await Users.findOne({id: user_});
          if (!user) {
            return res.status(404).send({
              error: "User not found",
              user: user
            });
          }
          arrayUsers.push(user._id);
        }
        req.body.users = arrayUsers;
      }
      try {
        const track = await Track.findOneAndUpdate({id: Number(req.params.id)}, req.body, {
        new: true, 
        runValidators: true});
          if (!track) {
            return res.status(404).send();
          }
          if (req.body.users){
            for(const user of track.users) {
              await Users.findOneAndUpdate({_id: user}, {$push: {favRoutes: track._id}});
            }
          }
            return res.send(track);
      } catch (error) {
          return res.status(500).send(error);
      }
    }

  });
  
  /**
   * method to delete a track
   * - if the query name is provided, it will delete the track with that name
   * - if the query id is provided, it will delete the track with that id
   * 
   * @param {string} name - name of the track
   * @param {string} initialGeo - initial point of the track
   * @param {string} finalGeo - final point of the track
   * @param {number} kmLength - length of the track
   * @param {number} avegLevel - average level of the track
   * @param {array} users - users that have the track as a favourite
   * @param {string} activityType - type of activity of the track
   * @param {number} avegMark - average mark of the track
   * 
   */
trackRouter.delete('/tracks', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const track = await Track.findOne(filter);
    if (!track) {
      return res.status(404).send();
    }

        
    // ELiminar de los favRoutes
    for (const favRoute of track.users) {
      await Users.findOneAndUpdate({_id: favRoute}, {$pull: {favRoutes: track._id}});
    } 
    await Track.findOneAndDelete(filter)
    return res.send(track);
  } catch (error) {
    return res.status(500).send(error);
  }

});


  /**
   * method to delete a track
   * - if the query name is provided, it will delete the track with that name
   * - if the query id is provided, it will delete the track with that id
   * 
   * @param {string} name - name of the track
   * @param {string} initialGeo - initial point of the track
   * @param {string} finalGeo - final point of the track
   * @param {number} kmLength - length of the track
   * @param {number} avegLevel - average level of the track
   * @param {array} users - users that have the track as a favourite
   * @param {string} activityType - type of activity of the track
   * @param {number} avegMark - average mark of the track
   * 
   */
trackRouter.delete('/tracks/:id', async (req, res) => {

  const filter = req.params.id?{id: req.params.id}:{};

  try {
    const track = await Track.findOne(filter);
    if (!track) {
      return res.status(404).send();
    }        
    // ELiminar de los favRoutes
    for (const favRoute of track.users) {
      await Users.findOneAndUpdate({_id: favRoute}, {$pull: {favRoutes: track._id}});
    } 
    await Track.findOneAndDelete(filter)
    return res.send(track);
  } catch (error) {
    return res.status(500).send(error);
  }

});
