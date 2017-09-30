const chai = require('chai');
const chaiCheerio = require('chai-cheerio');
const chaiHttp = require('chai-http');
const cheerio = require('cheerio');
const app = require('../app');
const mongoose = require('../mongoose');
const config = require('../config');
const mock = require('./mock');
const {User} = require('../models/user');

chai.use(chaiHttp);
chai.use(chaiCheerio);
const should = chai.should();

describe.skip('Test Utility middleware', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL, {useMongoClient: true})
    .catch((err) => console.log(['connect error', err])));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase()
    .catch((err) => console.log(['before each clear error', err])));
  after('Clear database', () => mongoose.connection.dropDatabase()
    .catch((err) => console.log(['after clear error', err])));
  after('Disconnect mongoose', () => mongoose.disconnect()
    .catch((err) => console.log(['disconnect error', err])));

  const login = (agent, user) => agent.post('/users/login').type('form')
    .send({email: user.email, password: user.password});

  it('should only be accessible for loggedin users', () => {
    const user = mock.user();
    const agent = chai.request.agent(app);
    User.create(user)
      .then(() => login(agent, user))
      .then(() => agent.get('/protected'))
      .then((response) => response.status.should.equal(200));
  });
});
