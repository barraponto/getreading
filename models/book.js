const mongoose = require('../mongoose');
const config = require('../config');

const BookSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String},
  pages: {type: Number},
});

const Book = mongoose.model('Book', BookSchema);

module.exports = {Book};
