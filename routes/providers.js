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
router.post('/client/:clientId/addProvider', checkAuth, function (req, res, next) {

    try {
        var clientId = new ObjectID(req.params.clientId);
    } catch (e) {
        return next(404, 'Неправильный ID клиента');
    }

    Client.findById(clientId, function(err, client) {
        if (err) return next('Клинет с таким ID ненайден');

        var provider = new Provider({
            name: req.body.name,
            city: req.body.city,
            clientId: client.id
        });

        provider.save(function (err, provider, affected) {
            if (err) {
                log.err(err);
                return next(err.message);
            } else {
                // Редирект на страницу клиента
                req.session.flashMessage.push('Поставщик добавлен');
                res.redirect('/client/'+ client.id);
            }
        });
    });
});

// Получение провайдеров по clientId
router.post('/provider/get/:clientId/:limit?', checkAuth, function(req, res, next) {
    try {
        var clientId = new ObjectID(req.params.clientId);
    } catch (e) {
        log.error(e);
        return next(404, 'Ошибка Id');
    }
    var limit = parseInt(req.params.limit);
    limit = limit > 0 ? limit : 0;

    ProviderRepository.providerListByClientId(clientId, 0, next, function(err, providers) {
        if (err) {
            next(500, 'Ошибка выборки провайдеров');
        }

        if (limit == 1) {
            providers = providers.pop();
        }

        var providersJson = _.map(providers, function(provider) {
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
    })
});

router.delete('/provider/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
        log.debug(id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

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

                res.json({
                    "message": "Поставщик удален",
                    "success": true
                });
            });
        }
    });
});

module.exports = router;
