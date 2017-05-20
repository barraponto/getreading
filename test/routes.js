const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const app = require('../app');
const mongoose = require('../mongoose');
const config = require('../config');

chai.use(chaiHttp);
const should = chai.should();

describe('Test forms', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  before('Clear database', () => mongoose.connection.dropDatabase());

  it('should GET the /users/signup form', () =>
    chai.request(app).get('/users/signup')
    .then((response) => {
      response.statusCode.should.equal(200);
      response.type.should.equal('text/html');
    })
  );

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
