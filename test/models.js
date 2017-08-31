const chai = require('chai');
const mongoose = require('../mongoose');
const config = require('../config');
const mock = require('./mock');
const {User} = require('../models/user');
const {Book} = require('../models/book');

const should = chai.should();

describe('Test model', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL, {useMongoClient: true}));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase());

  it('should save User', () => {
    const userData = mock.user();
    return User.create(userData)
      .then((user) => {
        user.email.should.be.a('string');
        user.email.should.equal(userData.email);
      })
  });

  it('should check User pasword', () => {
    const userData = mock.user();
    return User.create(userData)
      .then((user) => User.findById(user.id))
      .then((user) => user.checkPassword(userData.password))
      .then((result) => result.should.be.ok)
  });

  it('should save Book', () => {
    const bookData = mock.book();
    return Book.create(bookData)
      .then((book) => {
        book.title.should.be.a('string');
        book.title.should.equal(bookData.title);
        book.author.should.be.a('string');
        book.author.should.equal(bookData.author);
        book.pages.should.be.a('number');
        book.pages.should.equal(bookData.pages);
      })
  });

  it('should add book to User library', () => {
    const userData = mock.user();
    const bookData = mock.book();
    return Promise.all([User.create(userData), Book.create(bookData)])
      .then(([user, book]) => Promise.all([user.addBook(book.id), book]))
      .then(([user, book]) => {
        user.library.should.be.an('array');
        user.library.should.contain(book.id);
      })
  });

  it('should check if an User owns a book', () => {
    const userData = mock.user();
    const bookData = mock.book();
    return Promise.all([User.create(userData), Book.create(bookData)])
      .then(([user, book]) => Promise.all([user.addBook(book.id), book]))
      .then(([user, book]) => user.owns(book.id).should.be.ok)
  });

  it('should check if a populated User owns a book', () => {
    const userData = mock.user();
    const bookData = mock.book();
    return Promise.all([User.create(userData), Book.create(bookData)])
      .then(([user, book]) => Promise.all([user.addBook(book.id), book]))
      .then(([user, book]) => Promise.all([User.findById(user.id).populate('library'), book]))
      .then(([user, book]) => user.owns(book.id).should.be.ok)
  });

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
