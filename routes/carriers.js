var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var CarrierModel = require('../models/carriers').CarrierModel;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var checkAuth = require('../middleware/checkAuth');

//mount routes
router.get('/carriers', checkAuth, function(req, res) {
    CarrierModel.find().sort({'created': 1}).exec(function(err, data) {
        if (err) {
            res.statusCode(200);
            log.debug('Error get carrier');
        } else {
            res.render('carrier/carriers', {
               carrierList: data
            });
        }
    });
});

router.get('/add_carrier', checkAuth, function(req, res) {
  res.render('carrier/addCarrier', {
    title: 'Добавить перевозчика'
  });
});

router.post('/add_carrier', checkAuth, function(req, res, next) {
    var carrier = new CarrierModel({
        name: req.body.name,
        description: req.body.description,
        city: req.body.city
    });

    carrier.save(function(err, carrier, affected) {
        if (err) {
            next(err.message);
        } else {
            res.location('carriers');
            res.redirect('carriers');
        }
    });
});

router.delete('/carrier/:id', checkAuth, function(req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch(e) {
        log.error(e.message);
        return next(404);
    }

    CarrierModel.findById(id, function(err, carrier) {
        if (err) return next(err);

        if (!carrier) {
            res.json({
                message: "Record not found.",
                success: true
            });
            log.debug('Carrier with id ' + id + ' not found');
        } else {
            carrier.remove(function(err) {
                if (err) throw err;

                res.json({
                    message: "Перевозчик удален",
                    success: true
                });
            });
        }
    });
});

module.exports = router;
