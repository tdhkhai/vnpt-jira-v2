const express = require('express');
const app = express();
const invoiceRoute = express.Router();

// Invoice model
let Invoice = require('../models/Invoice');

// Add Invoice
invoiceRoute.route('/create').post((req, res, next) => {
  Invoice.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Invoices
invoiceRoute.route('/').get((req, res) => {
  Invoice.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get All Invoices Activated
invoiceRoute.route('/activatedinvoices').get((req, res) => {
  Invoice.find({ status: 1 }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single Invoice
invoiceRoute.route('/read/:id').get((req, res) => {
  Invoice.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update Invoice
invoiceRoute.route('/update/:id').put((req, res, next) => {
  Invoice.findByIdAndUpdate(req.params.id, {
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
invoiceRoute.route('/delete/:id').delete((req, res, next) => {
  Invoice.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

// Sumary theo thang
invoiceRoute.route('/sumary-theo-thang').post((req, res, next) => {
  Invoice.aggregate([
    // Tìm các khách hàng tạo theo tháng
    {
      $match: {
        incomeDate: new Date(req.body.month),
        typeOfIncome: req.body.toi
      }
    },
    //
    {
      $group: {
        _id: "$unitCode",
        count: { $sum: 1 },
        totalIncome: { $sum: "$income" }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ], (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

// Sumary theo thang - AM
invoiceRoute.route('/sumary-theo-thang-am').post((req, res, next) => {
  Invoice.aggregate([
    // Tìm các khách hàng tạo theo tháng
    {
      $match: {

        incomeDate: new Date(req.body.month),
        typeOfIncome: req.body.toi
      }
    },
    //
    {
      $group: {
        _id: {
          unitCode: "$unitCode",
          userName: "$userName"
        },
        count: { $sum: 1 },
        totalIncome: { $sum: "$income" }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ], (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

// So lieu Site - AM
invoiceRoute.route('/so-lieu-site-am').post((req, res, next) => {
  Invoice.aggregate([
    // Tìm các khách hàng tạo theo tháng
    {
      $facet: {
        // Dem so luong chuyen chinh thuc trong thang
        "countGoliveinMonth": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              dateGolive: { $gte: new Date(req.body.month), $lte: new Date(req.body.eomonth) },
              dateDemo: { $gte: new Date(req.body.month), $lte: new Date(req.body.eomonth) }
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode", userName: "$userName" },
              countGoliveinMonth: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ],
        // Dem so luong chuyen chinh thuc cac thang
        "countGolive": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              dateGolive: { $gte: new Date(req.body.month), $lte: new Date(req.body.eomonth) },
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode", userName: "$userName" },
              countGolive: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ],
        // Dem so luong chuyen chinh thuc trong thang
        "countSiteCreated": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              monthAction: new Date(req.body.month),
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode", userName: "$userName" },
              countSiteCreated: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ],// Dem so luong Demo chua chuyen chinh thuc
        "countDemoNotGoliveInMonth": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              status: "Demo",
              monthAction: new Date(req.body.month),
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode", userName: "$userName" },
              countDemoNotGoliveInMonth: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ]
      }
    },
    // Ghep cac mang ket qua
    {
      $project: {
        all: {
          $concatArrays: ["$countGoliveinMonth", "$countGolive", "$countSiteCreated", "$countDemoNotGoliveInMonth"]
        }
      }
    },
    // Tach thanh tung document
    {
      $unwind: "$all"
    },
    // Gom lai
    {
      $group: {
        _id: {
          unitCode: "$all._id.unitCode",
          userName: "$all._id.userName",
        },
        countGoliveinMonth: { $sum: "$all.countGoliveinMonth" },
        countGolive: { $sum: "$all.countGolive" },
        countSiteCreated: { $sum: "$all.countSiteCreated" },
        countDemoNotGoliveInMonth: { $sum: "$all.countDemoNotGoliveInMonth" },
      }
    },
    {
      $sort: {
        "_id.unitCode": 1
      }
    }
  ], (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

// So lieu Site - Don vi
invoiceRoute.route('/so-lieu-site-don-vi').post((req, res, next) => {
  Invoice.aggregate([
    // Tìm các khách hàng tạo theo tháng
    {
      $facet: {
        // Dem so luong chuyen chinh thuc trong thang
        "countGoliveinMonth": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              dateGolive: { $gte: new Date(req.body.month), $lte: new Date(req.body.eomonth) },
              dateDemo: { $gte: new Date(req.body.month), $lte: new Date(req.body.eomonth) }
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode", },
              countGoliveinMonth: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ],
        // Dem so luong chuyen chinh thuc cac thang
        "countGolive": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              dateGolive: { $gte: new Date(req.body.month), $lte: new Date(req.body.eomonth) },
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode", },
              countGolive: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ],
        // Dem so luong chuyen chinh thuc trong thang
        "countSiteCreated": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              monthAction: new Date(req.body.month),
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode", },
              countSiteCreated: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ],// Dem so luong Demo chua chuyen chinh thuc
        "countDemoNotGoliveInMonth": [
          {
            "$match": {
              unitCode: { $exists: true },
              userName: { $exists: true },
              status: "Demo",
              monthAction: new Date(req.body.month),
            }
          },
          {
            "$group": {
              _id: { unitCode: "$unitCode" },
              countDemoNotGoliveInMonth: { $sum: 1 }
            },
          },
          {
            "$sort": { "_id.unitCode": 1 }
          }
        ]
      }
    },
    // Ghep cac mang ket qua
    {
      $project: {
        all: {
          $concatArrays: ["$countGoliveinMonth", "$countGolive", "$countSiteCreated", "$countDemoNotGoliveInMonth"]
        }
      }
    },
    // Tach thanh tung document
    {
      $unwind: "$all"
    },
    // Gom lai
    {
      $group: {
        _id: {
          unitCode: "$all._id.unitCode",
        },
        countGoliveinMonth: { $sum: "$all.countGoliveinMonth" },
        countGolive: { $sum: "$all.countGolive" },
        countSiteCreated: { $sum: "$all.countSiteCreated" },
        countDemoNotGoliveInMonth: { $sum: "$all.countDemoNotGoliveInMonth" },
      }
    },
    {
      $sort: {
        "_id.unitCode": 1
      }
    }
  ], (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})



module.exports = invoiceRoute;