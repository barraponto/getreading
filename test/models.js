const chai = require('chai');
const mongoose = require('../mongoose');
const config = require('../config');
const mock = require('./mock');
const {User} = require('../models/user');
const {Book} = require('../models/book');

const should = chai.should();

describe('Test model', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  before('Clear database', () => mongoose.connection.dropDatabase());

  it('should save User', () =>
    User.create(mock.user).then((user) => {
      user.email.should.be.a('string');
      user.email.should.equal(mock.user.email);
      mock.user.id = user.id;
    })
  );

  it('should check User pasword', () =>
    User.findById(mock.user.id)
      .then((user) => user.checkPassword(mock.user.password))
      .then((result) => result.should.be.ok)
  );

  it('should save Book', () =>
    Book.create(mock.book).then((book) => {
      book.title.should.be.a('string');
      book.title.should.equal(mock.book.title);
      book.author.should.be.a('string');
      book.author.should.equal(mock.book.author);
      book.pages.should.be.a('number');
      book.pages.should.equal(mock.book.pages);
      mock.book.id = book.id;
    })
  );

  it('should add book to User library', () =>
    User.findByIdAndUpdate(
      mock.user.id, {$push: {library: mock.book.id}}, {new: true})
      .then((user) => {
        user.library.should.be.an('array');
        user.library.should.contain(mock.book.id);
      })
  );

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
