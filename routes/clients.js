var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var Client = require('../models/clients').Client;
var Provider = require('../models/providers').Provider;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var checkAuth = require('../middleware/checkAuth');

//mount routes
router.get('/clients', function (req, res) {
    Client.find().sort({'created': 1}).exec(function (err, clientList) {
        if (err) throw (500);

        res.render('client/clients', {
            clientList: clientList
        });
    });
});

router.get('/addClient', function (req, res) {
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

router.get('/client/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    async.waterfall([
            // Получаем клиента по id
            function (callback) {
                Client.findById(id).exec(callback);
            },
            // Получить всех провайдеров
            function (client, callback) {
                if (!client) {
                    log.error('Client with is ID:' + id);
                    next('Клиент не найден');
                } else {
                    Provider.find({clientId: id}).sort({'created': 1}).exec(function (err, providers) {
                        callback(null, client, providers);
                    });
                }
            }
        ],
        function (err, client, providers) {
            res.render('client/clientInfo', {
                client: client,
                providers: providers,
                flashMessage: req.session.flashMessage.pop()
            });
        }
    );
});

router.delete('/client/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
        log.debug(id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    Client.findById(id, function (err, client) {
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

module.exports = router;
