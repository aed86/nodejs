var express = require('express');
var router = express.Router();
var log = require('../libs/log')(module);
var mongoose = require('../libs/mongoose');
var Client = require('../models/clients').Client;
var Provider = require('../models/providers').Provider;
var Carrier = require('../models/carriers').CarrierModel;
var Application = require('../models/applications').Applications;
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var checkAuth = require('../middleware/checkAuth');

//mount routes
router.get('/table', checkAuth, function (req, res, next) {

    async.parallel({
            applications: function(callback) {
                Application
                    .find()
                    .populate('carrier')
                    .populate('client')
                    .populate('provider')
                    .exec(callback);
            },
            carriers: function (callback) {
                Carrier.find().sort({created: 1}).exec(callback);
            },
            clients: function (callback) {
                Client
                    .find()
                    .sort({created: 1})
                    .populate('providers')
                    .exec(callback);
            }
        },
        function (err, results) {
            if (err) {
                next(err);
            }

            console.log("Result: ", results.applications);
            var providers = [],
                city = '';

            // Получаем значение полей "Перевозчики" и "Город" для первого клиента
            if (results.clients[0] && results.clients[0].providers) {
                providers = results.clients[0].providers;
                city = providers[0].city
            }

            res.render('table/index', {
                applications: results.applications,
                carriers: results.carriers,
                clients: results.clients,
                providers: providers,
                city: city
            });
        });
});

// Добавление новой записи
router.post('/table/add', checkAuth, function (req, res, next) {

    var data = req.body;

    var isValid = data.legalEntity && data.carrier && data.client && data.provider;
    if (!isValid) {
        req.session.flashMessage.push('Вы заполнили не все поля');
        res.redirect('/table');
    } else {

        try {
            var carrierId = new ObjectID(data.carrier);
            var clientId = new ObjectID(data.client);
            var providerId = new ObjectID(data.provider);
        } catch (e) {
            req.session.flashMessage.push('Неверные данные');
            res.redirect('/table');
        }

        async.parallel({
            carrier: function (callback) {
                Carrier.findById(carrierId).exec(callback);
            },
            client: function (callback) {
                Client.findById(clientId).exec(callback);
            },
            provider: function (callback) {
                Provider.findById(providerId).exec(callback);
            }
        }, function (err, results) {
            if (err) {
                next(err);
            }

            var application = new Application({
                legalEntity: data.legalEntity,
                carrier: results.carrier.id,
                client: results.client.id,
                provider: results.provider.id
            });

            application.save(function (err, application) {
                if (err) {
                    next(err);
                }

                req.session.flashMessage.push('Заявка добавлена');
                res.redirect('/table');
            });

            console.log(results);
        });
    }
});

module.exports = router;
