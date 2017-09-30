const express = require('express');
const router = express.Router();
const {passport} = require('../passport');
const {Book} = require('../models/user');
const {requiredFields} = require('./utils');

/* GET books listing. */
/* @TODO: implement book listing */
router.get('/');

/* GET book add form */
router.get('/add',
  (req, res) => res.render('book-add')
);

/* GET book view */
router.get('/:id');

/* POST new book from form */
/* @TODO: implement book POST */
router.post('/add',
  requiredFields([]),
  (req, res) => { // actually creates the Book
    Book.create({})
    .then((book) => res.redirect('/users/login'))
    .catch((err) => res.status(500).json({error: err}));
  }
);

module.exports = router;
