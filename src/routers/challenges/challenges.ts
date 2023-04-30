import express from 'express';
import { Challenges } from '../../models/challenges.js';

export const challengesRouter = express.Router();

challengesRouter.post('/challenges', (req, res) => {
  
  const challenge = new Challenges(req.body);

  challenge.save().then((challenge) => {
    res.status(201).send(challenge);
  }).catch((error) => {
    res.status(400).send(error);
  });

});

challengesRouter.get('/challenges', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Challenges.find(filter).then((challenge) => {
    if (challenge.length !== 0) {
      res.send(challenge);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

challengesRouter.get('/challenges/:id', (req, res) => {
  Challenges.findById(req.params.id).then((challenge) => {
    if (!challenge) {
      res.status(404).send();
    } else {
      res.send(challenge);
    }
  }).catch(() => {
    res.status(500).send();
  });
});

/*
  id: number;
  name: string;
  ruteChallenge: number[];
  typeActivitie: "bicicleta" | "correr";
  kmTotal: number;
  idUsersCahllenge: number[];
 */

challengesRouter.patch('/challenges', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'ruteChallenge', 'typeActivitie', 'kmTotal', 'idUsersCahllenge'];
    const actualUpdates = Object.keys(req.body);
    console.log(actualUpdates);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Challenges.findOneAndUpdate({name: req.query.name.toString()}, req.body, {
        new: true,
        runValidators: true,
      }).then((challenge) => {
        if (!challenge) {
          res.status(405).send();
        } else {
          res.send(challenge);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});