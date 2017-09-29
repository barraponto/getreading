const chai = require('chai');
const chaiCheerio = require('chai-cheerio')
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

describe('Test Utility middleware', () => {
  const login = (agent, user) => agent.post('/users/login').type('form')
    .send({email: user.email, password: user.password});

  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL, {useMongoClient: true}));
  beforeEach('Clear database', () => mongoose.connection.dropDatabase());

  it('should only be accessible for loggedin users', () => {
    const user = mock.user();
    const agent = chai.request.agent(app);
    User.create(user)
      .then(() => login(agent, user))
      .then(() => agent.get('/protected'))
      .then((response) => response.status.should.equal(200));
  });

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
