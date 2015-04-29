var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var UserModel = require('../models/users').UserModel;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var AuthError = require('../models/users').AuthError;
var HttpError = require('../error/index').HttpError;

router.get('/register', function (req, res) {
    res.render('register', {
        title: 'Регистрация'
    });
});

router.post('/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    UserModel.authorize(username, password, function(err, user) {
        if (err) {
            if (err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        }

        res.session.user = user._id;
        res.json({
            success: true
        });
    });
});

module.exports = router;
