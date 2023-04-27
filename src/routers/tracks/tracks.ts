import express from 'express';
import { Track } from '../../models/tracks.js';

export const trackRouter = express.Router();



trackRouter.post('/tracks', (req, res) => {
    
  const track = new Track(req.body);

  track.save().then((track) => {
    res.status(201).send(track);
  }).catch((error) => {
    res.status(400).send(error);
  });

});

trackRouter.get('/tracks', (req, res) => {
  const filter = req.query.id?{id: Number(req.query.id)}:{};
  Track.find(filter).then((tracks) => {
    if (tracks.length !== 0) {
      res.send(tracks);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});
