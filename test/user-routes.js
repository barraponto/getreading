const chai = require('chai');
const chaiCheerio = require('chai-cheerio')
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const app = require('../app');
const mongoose = require('../mongoose');
const config = require('../config');
const mock = require('./mock');

chai.use(chaiHttp);
chai.use(chaiCheerio);
const should = chai.should();

describe('Test Login and Signup forms', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL, {useMongoClient: true}));
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
        $('input[name="email"]').should.have.attr('type').equal('email');
        $('input[name="password"]').should.have.attr('type').equal('password');
        $('input[name="repeat-password"]').should.have.attr('type').equal('password');
      })
  );

  it('should POST /users/signup form and fail required fields', () => {
    const user = mock.user();
    return chai.request.agent(app)
      .post('/users/signup')
      .type('form')
      .send({email: user.email})
      .then((response) => {
        response.should.redirect;
        response.should.redirectTo(
          `${response.request.protocol}//${response.request.host}/users/signup`);
        const $ = cheerio.load(response.text);
        $('.error').should.exist;
        $('.error').text().should.equal('password, repeat-password cannot be empty.');
      });
  });

  it('should POST /users/signup form and fail confirmed fields', () => {
    const user = mock.user();
    chai.request.agent(app).post('/users/signup')
      .type('form').send({
        email: user.email,
        password: user.password,
        "repeat-password": user.password + '420',
      }).then((response) => {
        response.should.redirect;
        response.should.redirectTo(
          `${response.request.protocol}//${response.request.host}/users/signup`);

        const $ = cheerio.load(response.text);
        $('.error').should.exist;
        $('.error').text().should.equal('repeat-password has a different value from password.');
      })
  });

  it('should POST /users/signup form and redirect to login', () => {
    const user = mock.user();
    chai.request.agent(app)
      .post('/users/signup')
      .type('form')
      .send({
        email: user.email,
        password: user.password,
        "repeat-password": user.password
      })
      .then((response) => {
        response.should.redirect;
        response.should.redirectTo(
          `${response.request.protocol}//${response.request.host}/users/login`);
      })
  });

  it('should GET /users/login form', () => chai.request(app)
    .get('/users/login')
    .then((response) => {
      response.statusCode.should.equal(200);
      response.type.should.equal('text/html');

      const $ = cheerio.load(response.text);
      $('form').should.exist;
      $('form').should.have.attr('method').equal('POST');
      ['email', 'password'].forEach((name) => {
        $(`input[name="${name}"]`).should.exist;
        $(`label[for="${name}"]`).should.exist;
      });
      $('input[name="email"]').should.have.attr('type').equal('email');
      $('input[name="password"]').should.have.attr('type').equal('password');
    })
  );

  it('should POST /users/login form and fail', () => {
    const user = mock.user();
    chai.request.agent(app)
      .post('/users/login')
      .type('form')
      .send({email: user.email, password: user.password + '420'})
      .then((response) => {
        response.should.redirect;
        response.should.redirectTo(
          `${response.request.protocol}//${response.request.host}/users/login`);
        const $ = cheerio.load(response.text);
        $('.error').should.exist;
        $('.error').text().should.equal('The username or password entered is incorrect.');
    })
  });

  it('should POST /users/login form', () => {
    const user = mock.user();
    chai.request.agent(app)
      .post('/users/login')
      .type('form')
      .send({email: user.email, password: user.password})
      .then((response) => {
        response.should.redirect;
        response.should.redirectTo(
          `${response.request.protocol}//${response.request.host}/`);
        response.status.should.equal(200);
      })
  });

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
