const express = require('express');
const router = express.Router();
const {User} = require('../models/user')
const {requiredFields} = require('./utils');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

/* GET user signup form */
router.get('/signup', (req, res) => res.render('signup'));

/* POST new user from signup */
router.post('/signup',
  requiredFields(['email', 'password', 'repeat-password']),
  (req, res, next) => { // checks for proper passwords
    if (req.body.password === req.body['repeat-password']){
      next()
    } else {
      res.status(400).json({error: 'The repeated passwords do not match.'})
    }
  },
  (req, res) => { // actually creates the User
    User.create({email: req.body.email, password: req.body.password})
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json({error: err}));
  }
);

module.exports = router;
