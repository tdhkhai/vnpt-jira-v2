const express = require('express');
const app = express();
const idcRoute = express.Router();

// IDC model
let IDC = require('../models/IDC');

// Add IDC
idcRoute.route('/create').post((req, res, next) => {
  IDC.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All IDCs
idcRoute.route('/').get((req, res) => {
  IDC.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get All IDCs Activated
idcRoute.route('/activatedIDCs').get((req, res) => {
  IDC.find({ status: 1 }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single IDC
idcRoute.route('/read/:id').get((req, res) => {
  IDC.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update IDC
idcRoute.route('/update/:id').put((req, res, next) => {
  IDC.findByIdAndUpdate(req.params.id, {
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
idcRoute.route('/delete/:id').delete((req, res, next) => {
  IDC.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})


module.exports = idcRoute;