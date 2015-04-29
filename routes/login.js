var express = require('express');
var router = express.Router();
var mongoose = require('../libs/mongoose');
var UserModel = require('../models/users').UserModel;
var log = require('../libs/log')(module);
var ObjectID = require('mongodb').ObjectID;
var async = require('async');

router.get('/login', function (req, res) {
    res.render('login', {
        title: 'Войти'
    });
});

router.post('/login', function (req, res, next) {
    async.waterfall([
            function (callback) {
                UserModel.findOne({username: req.body.username}).exec(callback);
            },
            function (user, callback) {
                if (!user) {
                    res.json({
                        success: false,
                        message: 'Логин или пароль неверен.'
                    });

                    //user = new User({
                    //    username: req.body.username,
                    //    password: req.body.password
                    //});
                    //// если просто user.save(callback), то будет лишний аргумент у следующей функции
                    //user.save(function (err, user, affected) {
                    //    callback(err, user);
                    //});
                } else {
                    if (user.checkPassword(req.body.password)) {
                        callback(null, user);
                    } else {
                        res.send(403, 'Логин или пароль неверен.');
                    }
                }
            }
        ],
        function (err, user) {
            if (err) {
                return next(err);
            }

            req.session.user = user._id;
            res.json(user.getPublicFields());
        }
    );
});

module.exports = router;
