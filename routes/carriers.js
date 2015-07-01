var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var CarrierModel = require('../models/carriers').CarrierModel;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var checkAuth = require('../middleware/checkAuth');
var _ = require('underscore');

//mount routes
router.get('/carriers', checkAuth, function (req, res) {
    CarrierModel.find().sort({'created': 1}).exec(function (err, data) {
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

router.get('/add_carrier', checkAuth, function (req, res) {
    res.render('carrier/addCarrier', {
        title: 'Добавить перевозчика'
    });
});

// Получение информации о перевозчике ajax
router.get('/carrier/info/:id/:legalEntity', function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    var legalEntityId = req.params.legalEntity || req.app.locals.legalEntity[0].id;

    CarrierModel.findById(id, function (err, carrier) {
        if (err) return next(err);

        if (!carrier) {
            res.json({
                message: "Запись не найдена",
                success: true
            });
            log.debug('Carrier with id ' + id + ' not found');
        } else {

            // Фильтруем список по ЮрЛицу
            var elm = _.filter(carrier.applications, function(item) {
                return item.legalEntity == legalEntityId;
            });

            // Получаем максимальный номер заявки
            var maxNum = _.max(elm, function(item){
                return item.number;
            }).number;
            if (!maxNum) {
                maxNum = 0;
            }

            res.json({
                success: true,
                carrier: {
                    name: carrier.name,
                    count: maxNum
                }
            });
        }
    });
});

router.post('/add_carrier', checkAuth, function (req, res, next) {
    var carrier = new CarrierModel({
        name: req.body.name,
        description: req.body.description,
        city: req.body.city
    });

    carrier.save(function (err, carrier, affected) {
        if (err) {
            next(err.message);
        } else {
            res.location('carriers');
            res.redirect('carriers');
        }
    });
});

router.delete('/carrier/:id', checkAuth, function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        log.error(e.message);
        return next(404);
    }

    CarrierModel.findById(id, function (err, carrier) {
        if (err) return next(err);

        if (!carrier) {
            res.json({
                message: "Record not found.",
                success: true
            });
            log.debug('Carrier with id ' + id + ' not found');
        } else {
            carrier.remove(function (err) {
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
