var express = require('express');
var app = express();

var log = require('./libs/log')(module);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./libs/config');
var errorHandler = require('errorhandler');
var HttpError = require("./error/index").HttpError;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middleware/sendHttpError'));

// set view locals
app.use(function (req, res, next) {
    app.locals.route = req.url;

    app.locals.topMenu = [
        {
            url: '/',
            title: 'Home'
        },
        {
            url: '/claims',
            title: 'Заявки'
        },
        {
            url: '/carriers',
            title: 'Перевозчики'
        }
    ];
    next()
});

// Make our db accessible to our router
app.use(function (req, res, next) {
    //req.db = mongoose.connection;
    next();
});

app.use(require('./routes/home'));
app.use(require('./routes/claims'));
app.use(require('./routes/carriers'));

app.use(function (err, req, res, next) {
    if (typeof err == 'number') { // next(404)
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });

        log.error(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
