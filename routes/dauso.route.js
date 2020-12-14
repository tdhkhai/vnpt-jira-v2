const express = require('express');
const app = express();
const dausoRoute = express.Router();

// Dauso model
let Dauso = require('../models/Dauso');

// Add Dauso
dausoRoute.route('/create').post((req, res, next) => {
  Dauso.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Dausos
dausoRoute.route('/').get((req, res) => {
  Dauso.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get All Dausos Activated
dausoRoute.route('/activatedDausos').get((req, res) => {
  Dauso.find({ status: 1 }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single Dauso
dausoRoute.route('/read/:id').get((req, res) => {
  Dauso.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update Dauso
dausoRoute.route('/update/:id').put((req, res, next) => {
  Dauso.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete Invoice
dausoRoute.route('/delete/:id').delete((req, res, next) => {
  Dauso.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})


module.exports = dausoRoute;