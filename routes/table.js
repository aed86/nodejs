var express = require('express');
var router = express.Router();
var log = require('../libs/log')(module);

//mount routes
router.get('/table', function(req, res) {
  res.render('table', {

  });
});

module.exports = router;
