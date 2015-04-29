var express = require('express');
var router = express.Router();
var log = require('../libs/log')(module);

//mount routes
router.get('/', function(req, res) {
  res.redirect('home');
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

module.exports = router;
