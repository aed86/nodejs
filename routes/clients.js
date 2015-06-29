var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var Client = require('../models/clients').Client;
var Provider = require('../models/providers').Provider;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var checkAuth = require('../middleware/checkAuth');
var _ = require('underscore');

//mount routes
router.get('/clients', checkAuth, function (req, res) {
    Client.find().sort({'created': 1}).exec(function (err, clientList) {
        if (err) throw (500);

        res.render('client/clients', {
            clientList: clientList
        });
    });
});

router.get('/addClient', checkAuth, function (req, res) {
    res.render('client/addClient', {
        title: 'Добавить клиента'
    });
});

router.post('/addClient', checkAuth, function (req, res) {
    var client = new Client({
        name: req.body.name,
        description: req.body.description
    });

    client.save(function (err, client, affected) {
        if (err) {
            log.debug(err.message);
            res.send(err.message);
        } else {
            res.location('clients');
            res.redirect('clients');
        }
    });
});

router.post('/client/:id/edit', checkAuth, function (req, res) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    Client.findById(id, function (err, client) {
        client.name = req.body.name;
        client.description = req.body.description;
        client.save(function (err, client, affected) {
            if (err) {
                log.error(err);
                res.send(err.message);
            } else {
                res.redirect('/client/' + client.id);
            }
        });
    });
});

/**
 * Страница клиента
 */
router.get('/client/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    Client.findById(id).populate('providers').exec(function (err, client) {
        res.render('client/clientInfo', {
            client: client
        });
    });
});

/**
 * Удаление клиента
 */
router.delete('/client/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
        log.debug(id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    Client.findById(id, function (err, client) {
        console.log(id, client);
        if (err) return next(err);

        if (!client) {
            res.json({
                "message": "Record not found.",
                "status": "error"
            });
            log.debug('Client with id ' + id + ' not found');
        } else {
            client.remove(function (err) {
                if (err) throw err;

                res.json({
                    "message": "Ok",
                    "status": "success"
                });
            });
        }
    });
});

/**
 * Получение провайдеров по clientId
 */
router.post('/client/getProviders/:clientId/:limit?', checkAuth, function (req, res, next) {
    try {
        var clientId = new ObjectID(req.params.clientId);
    } catch (e) {
        log.error(e);
        return next(404, 'Ошибка Id');
    }

    var limit = parseInt(req.params.limit);
    limit = limit > 0 ? limit : 0;

    Client.findById(clientId).populate('providers').exec(function (err, client) {
        if (err) {
            next(500, 'Ошибка выборки провайдеров');
        }

        if (!client) {
            res.json({
                message: "Данный клиент не найден.",
                status: "error"
            });
            log.debug('Client with id ' + id + ' not found');
        } else {

            var providers = client.providers;

            if (limit == 1) {
                providers = providers.pop();
            }

            var providersJson = _.map(providers, function (provider) {
                return {
                    id: provider.id,
                    name: provider.name,
                    city: provider.city
                }
            });

            res.json({
                success: true,
                providers: providersJson
            });
        }

    });
});

router.get('/client/info/:id', function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    Client.findById(id, function (err, client) {
        if (err) return next(err);

        if (!client) {
            res.json({
                message: "Запись не найдена",
                success: true
            });
            log.debug('Client with id ' + id + ' not found');
        } else {
            res.json({
                success: true,
                client: {
                    name: client.name,
                    count: client.count
                }
            });
        }
    });
});

module.exports = router;
