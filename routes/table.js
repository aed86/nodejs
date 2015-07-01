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
var applicationRepository = require('../repositories/applicationRepository');
var _ = require('underscore');

//mount routes
router.get('/table', checkAuth, function (req, res, next) {

    async.parallel({
            applications: function (callback) {
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

            //console.log("Result: ", results.applications);
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

            var client = results.client;
            var carrier = results.carrier;

            async.parallel({
                appClientsCount: function (callback) {
                    applicationRepository.applicationCount({
                        legalEntity: data.legalEntity,
                        type: 'client',
                        id: client.id
                    }).exec(callback);
                },
                appCarriersCount: function (callback) {
                    applicationRepository.applicationCount({
                        legalEntity: data.legalEntity,
                        type: 'carrier',
                        id: carrier.id
                    }).exec(callback);
                }
            }, function (err, results2) {
                if (err) {
                    next(err);
                }

                // Сохраняем заявку
                var application = new Application({
                    legalEntity: data.legalEntity,
                    carrier: carrier.id,
                    carrierDate: new Date(data.carrierDate.replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$2/$1/$3")),
                    carrierCount: results2.appCarriersCount + 1, // увеличиваем счетчик
                    client: client.id,
                    clientDate: new Date(data.clientDate.replace(/(\d{2})\.(\d{2})\.(\d{4})/, "$2/$1/$3")),
                    clientCount: results2.appClientsCount + 1, // Номер заявки
                    provider: results.provider.id
                });
                application.save(function (err, application) {
                    if (err) {
                        next(err);
                    }

                    // обновляем счетчик клиента
                    client.applications.push({
                        legalEntity: application.legalEntity,
                        number: results2.appClientsCount + 1,
                        application: application
                    });
                    client.save(function (err, client) {
                        if (err) {
                            next(err);
                        }
                    });

                    carrier.applications.push({
                        legalEntity: application.legalEntity,
                        number: results2.appCarriersCount + 1,
                        application: application
                    });
                    // обновляем счетчик перевозчика
                    carrier.save(function (err, carrier) {
                        if (err) {
                            next(err);
                        }

                    });
                });


                req.session.flashMessage.push('Заявка добавлена');
                res.redirect('/table');
            });
        });
    }
});

router.delete('/table/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
        log.debug(id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    Application.findById(id)
        .populate('client')
        .populate('carrier')
        .exec(function (err, application) {
            if (err) {
                return next(err)
            }

            if (application) {
                application.remove(function (err) {
                    if (err) throw err;

                    var client = application.client;
                    client.applications = _.filter(client.applications, function (a) {
                        return a.application.toString() != id.toString();
                    });

                    client.save(function(err) {
                       if (err) next(err)
                    });

                    var carrier = application.carrier;
                    carrier.applications = _.filter(carrier.applications, function (a) {
                        return a.application.toString() != id.toString();
                    });

                    carrier.save(function(err) {
                        if (err) next(err);
                    });

                    res.json({
                        success: true,
                        message: "Заявка удалена"
                    });
                });
            } else {
                // Запись не найдена
                res.json({
                    success: false,
                    message: "Запись не найдена"
                });
            }
        });
});

module.exports = router;
