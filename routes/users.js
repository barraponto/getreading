const express = require('express');
const router = express.Router();
const {passport} = require('../passport');
const {User} = require('../models/user')
const {confirmedFields, requiredFields} = require('./utils');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

/* GET user signup form */
router.get('/signup', (req, res) => res.render('signup'));

/* POST new user from signup */
router.post('/signup',
  requiredFields(['email', 'password', 'repeat-password']),
  confirmedFields(['password', 'repeat-password']),
  (req, res) => { // actually creates the User
    User.create({email: req.body.email, password: req.body.password})
    .then((user) => res.redirect('/users/login'))
    .catch((err) => res.status(500).json({error: err}));
  }
);

/* GET user login form */
router.get('/login', (req, res) => res.render('login'));

/* POST user login form */
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
);

module.exports = router;
