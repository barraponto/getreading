const chai = require('chai');
const chaiCheerio = require('chai-cheerio')
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const faker = require('faker');
const app = require('../app');
const mongoose = require('../mongoose');
const config = require('../config');

chai.use(chaiHttp);
chai.use(chaiCheerio);
const should = chai.should();

describe('Test forms', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  before('Clear database', () => mongoose.connection.dropDatabase());

  it('should GET the /users/signup form', () =>
    chai.request(app).get('/users/signup')
    .then((response) => {
      response.statusCode.should.equal(200);
      response.type.should.equal('text/html');

      const $ = cheerio.load(response.text);
      $('form').should.exist;
      $('form').should.have.attr('method').equal('POST');
      ['email', 'password', 'repeat-password'].forEach((name) => {
        $(`input[name="${name}"]`).should.exist;
        $(`label[for="${name}"]`).should.exist;
      });
      $('input[name="password"]').should.have.attr('type').equal('password');
      $('input[name="repeat-password"]').should.have.attr('type').equal('password');
    })
  );

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
