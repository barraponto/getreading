const chai = require('chai');
const chaiCheerio = require('chai-cheerio');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const app = require('../app');
const mongoose = require('../mongoose');
const config = require('../config');
const mock = require('./mock');
const {signupAndAuthenticate} = require('./utils');
const {User} = require('../models/user');
const {Book} = require('../models/book');

chai.use(chaiHttp);
chai.use(chaiCheerio);
const should = chai.should();

describe('Test Book forms', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL, {useMongoClient: true})
    .catch((err) => console.log(['connect error', err])));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase()
    .catch((err) => console.log(['before each clear error', err])));
  after('Clear database', () => mongoose.connection.dropDatabase()
    .catch((err) => console.log(['after clear error', err])));
  after('Disconnect mongoose', () => mongoose.disconnect()
    .catch((err) => console.log(['disconnect error', err])));

  describe('while authenticated', () => {
    it('should GET the /books/add form', () =>
        signupAndAuthenticate(app)
        .then(([agent]) => agent.get('/books/add'))
        .then((response) => {
          response.statusCode.should.equal(200);
          response.type.should.equal('text/html');

          const $ = cheerio.load(response.text);
          $('form').should.exist;
          $('form').should.have.attr('method').equal('POST');
          ['title'].forEach((name) => {
            $(`input[name="${name}"]`).should.exist;
            $(`label[for="${name}"]`).should.exist;
          });
          $('input[name="title"]').should.have.attr('type').equal('text');
        })
    );
  });
  describe('while unauthenticated', () => {
    it('should GET the /books/add form and fail', () =>
      chai.request(app).get('/books/add')
        .catch((err) => {
          err.response.status.should.equal(401);
        })
    )
  });
});
