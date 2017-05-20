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

  it('should POST /users/signup form and fail required fields', () =>
    chai.request(app).post('/users/signup')
      .type('form').send({
        email: mock.user.email,
      }).catch((error) => {
        console.log(error.response.body);
        error.response.status.should.equal(400);
      })
  );

  it('should POST /users/signup form and fail confirmed fields', () =>
    chai.request(app).post('/users/signup')
      .type('form').send({
        email: mock.user.email,
        password: mock.user.password,
        "repeat-password": mock.user.password + '420',
      }).catch((error) => {
        console.log(error.response.body);
        error.response.status.should.equal(400);
      })
  );

  it('should POST /users/signup form and redirect to login', () =>
    chai.request(app).post('/users/signup')
      .type('form').send({
        email: mock.user.email,
        password: mock.user.password,
        "repeat-password": mock.user.password,
      }).then((response) => {
        console.log(response.body);
        response.status.should.equal(200);
      })
  );

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
