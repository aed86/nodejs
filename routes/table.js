var express = require('express');
var router = express.Router();
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Client = require('../models/clients').Client;
var Provider = require('../models/providers').Provider;
var Carrier = require('../models/carriers').CarrierModel;
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var checkAuth = require('../middleware/checkAuth');

//mount routes
router.get('/table', checkAuth, function (req, res, next) {

    async.parallel({
            carriers: function (callback) {
                Carrier.find().sort({created: 1}).exec(callback);
            },
            clients: function (callback) {
                Client.find().sort({created: 1}).exec(callback);
            }
        },
        function (err, results) {
            if (err) {
                next(err);
            }
            res.render('table/index', {
                applications: [],
                carriers: results.carriers,
                clients: results.clients
            });
        });


});

//mount routes
router.get('/table/add', checkAuth, function (req, res, next) {
    render.send('Hello');
});

module.exports = router;
