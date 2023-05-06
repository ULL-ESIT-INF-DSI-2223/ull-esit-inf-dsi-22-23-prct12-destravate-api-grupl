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
import { Track } from '../../models/tracks.js';

export const trackRouter = express.Router();



trackRouter.post('/tracks', async (req, res) => {
    
  const track = new Track(req.body);

  try {
    const track_ = await track.save();
    return res.status(201).send(track_);
  } catch (error) {
    return res.status(500).send(error);
  }

});

trackRouter.get('/tracks', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const track = await Track.find(filter);
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }


});

trackRouter.get('/tracks/:id', async (req, res) => {
  const filter = {id: Number(req.params.id)};
  
  try {
    const track = await Track.find(filter);
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }


});

trackRouter.delete('/tracks', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const track = await Track.findOneAndDelete(filter);
    if (!track) {
      return res.status(404).send();
    }
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }

});

trackRouter.delete('/tracks/:id', async (req, res) => {

  const filter = { id: Number(req.query.id)};

  try {
    const track = await Track.findOneAndDelete(filter);
    if (!track) {
      return res.status(404).send();
    }
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }

});

trackRouter.patch('/tracks', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({error: "No name provided"});
  } else {
    const allowedUpdates = ['name', 'initialGeo', 'finalGeo', 'kmLength', 'avegLevel', 'users', 'activityType', 'avegMark'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
    if (!isValidUpdate) {
      return res.status(400).send({error: "Invalid update"});
    } else {
        try {
          const track = await Track.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
            new: true, 
            runValidators: true});
          if (!track) {
            return res.status(404).send();
          }
          return res.status(201).send(track);
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
  });

  trackRouter.patch('/tracks/:id', async (req, res) => {
    const allowedUpdates = ['name', 'initialGeo', 'finalGeo', 'kmLength', 'avegLevel', 'users', 'activityType', 'avegMark'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update)); // comprobación si los parámetros a modificar están permitidos su modificación
    if (!isValidUpdate) {
      return res.status(400).send({error: "Invalid update"});
    } else {
      try {
        const track = await Track.findOneAndUpdate({id: Number(req.params.id)}, req.body, {
        new: true, 
        runValidators: true});
          if (!track) {
            return res.status(404).send();
          }
            return res.status(201).send(track);
      } catch (error) {
          return res.status(500).send(error);
      }
    }

  });