var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET user signup form */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

module.exports = router;
