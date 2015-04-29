var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var ClaimModel = require('../models/claims').ClaimModel;
var CarrierModel = require('../models/carriers').CarrierModel;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var async = require('async');

//mount routes
router.get('/claims', function (req, res) {
    //var carriers = CarrierModel.find();

    async.parallel([
            function(callback) {
                ClaimModel.find(callback);
            },
            function(callback) {
                CarrierModel.find(callback)
            }
        ],
        // result
        function(err, results) {
            if (err) next(err);
            res.render('claims', {
                claimList: results[0],
                carrierList: results[1]
            });
        }
    );
});

router.get('/addclaim', function (req, res) {

    res.render('add_claim', {
        title: 'Добавить заявку'
    });
});

router.post('/addclaim', function (req, res) {
    var claim = new ClaimModel({
        name: req.body.name,
        description: req.body.description
    });

    claim.save(function (err, claim, affected) {
        if (err) {
            log.debug(err.message);
            res.send(err.message);
        } else {
            res.location('claims');
            res.redirect('claims');
        }
    });
});

router.delete('/claim/:id', function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    ClaimModel.findById(id, function (err, claim) {
        if (err) return next(err);

        if (!claim) {
            res.json({
                "message": "Record not found.",
                "status": "error"
            });
            log.debug('Claim with id ' + id + ' not found');
        } else {
            claim.remove(function (err) {
                if (err) throw err;

                res.json({
                    "message": "Ok",
                    "status": "success"
                });
            });
        }
    });
});

module.exports = router;
