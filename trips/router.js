const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const {Trip} = require('./models');
const {User} = require('../users/models');

router.get('/', (req,res) => {
  res.sendFile(path.resolve('public/splash.html'));
});

router.get('/add', (req, res) =>{
  res.sendFile(path.resolve('public/add.html'));
});

router.get('/api/trips', (req, res) => {
  Trip
    .find()
    .exec()
    .then(trips => {
      res.json(trips.map(trip => trip.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

router.post('/api/trips', (req, res) => {
  const requiredFields = ['milesTraveled', 'date'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Trip
    .create({
      milesTraveled: req.body.milesTraveled,
      date: req.body.date
    })
    .then(trip => res.status(201).json(trip.apiRepr()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

router.put('/api/trips/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['milesTraveled', 'date'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Trip
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .exec()
    .then(updatedPost => res.status(201).json(updatedPost.apiRepr()))
    .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

router.delete('/api/trips/:id', (req, res) => {
  Trip
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'something went terribly wrong'});
    });
});

module.exports = router; 