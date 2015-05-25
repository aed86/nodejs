var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var Provider = require('../models/providers').Provider;
var ProviderRepository = require('../repositories/providerRepository');
var Client = require('../models/clients').Client;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var checkAuth = require('../middleware/checkAuth');
var _ = require('underscore');

//mount routes

// Добавление поставщика
router.post('/client/:clientId/addProvider', checkAuth, function (req, res, next) {

    try {
        var clientId = new ObjectID(req.params.clientId);
    } catch (e) {
        return next(404, 'Неправильный ID клиента');
    }

    async.waterfall([
        function (callback) {
            Client.findById(clientId).exec(callback);
        },
        function (client, callback) {
            var provider = new Provider({
                name: req.body.name,
                city: req.body.city,
                //clientId: client.id
            });

            provider.save(function (err, provider) {
                callback(err, client, provider);
            });
        }
    ], function (err, client, provider) {
        if (err) next('Какая-то ошибка #1');

        client.providers.push(provider.id);
        client.save(function(err, client) {
            if (err) next('Какая-то ошибка #1');

            req.session.flashMessage.push('Поставщик добавлен');
            res.redirect('/client/'+ client.id);
        });
    });
});

router.delete('/provider/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
        log.debug(id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    Client.find({providers: id}, function(err, client) {
        if (err) return next(err);

        //TODO: удалить из клиента зависимость
        //client.providers = _.without(client.providers, req.params.id);

        //console.log(client.providers);
        //res.send('123');

        Provider.findById(id, function (err, provider) {
            if (err) return next(err);

            if (!provider) {
                res.json({
                    "message": "Record not found.",
                    "success": true
                });
                log.debug('Client with id ' + id + ' not found');
            } else {
                provider.remove(function (err) {
                    if (err) throw err;

                    client.providers = _.without(client.providers, id);

                    res.json({
                        "message": "Поставщик удален",
                        "success": true
                    });
                });
            }
        });

    });

    //Provider.findById(id, function (err, provider) {
    //    if (err) return next(err);
    //
    //    if (!provider) {
    //        res.json({
    //            "message": "Record not found.",
    //            "success": true
    //        });
    //        log.debug('Client with id ' + id + ' not found');
    //    } else {
    //        provider.remove(function (err) {
    //            if (err) throw err;
    //
    //            res.json({
    //                "message": "Поставщик удален",
    //                "success": true
    //            });
    //        });
    //    }
    //});
});

module.exports = router;
