var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var Provider = require('../models/providers').Provider;
var Client = require('../models/clients').Client;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var checkAuth = require('../middleware/checkAuth');

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


    //async.waterfall([
    //        // Получаем клиента по clientId
    //        function (callback) {
    //            Client.findById(clientId).exec(callback);
    //        },
    //        // Проверяем, существует ли
    //        function (client, callback) {
    //            if (!client) {
    //                next('Клиент не найден');
    //            } else {
    //            }
    //        }
    //    ],
    //    function (err, result) {
    //        if (err) {
    //            return next(err);
    //        }
    //    }
    //);
});

module.exports = router;
