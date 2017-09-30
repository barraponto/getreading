const chai = require('chai');
const chaiHttp = require('chai-http');
const mock = require('./mock');
const {User} = require('../models/user');

chai.use(chaiHttp);

const authenticate = (agent, {email, password}) => agent
  .post('/users/login').type('form').send({email, password});

const signupAndAuthenticate = (app) => {
  const agent = chai.request.agent(app);
  const mocked = mock.user();
  return User.create(mocked)
    .then((user) => Promise.all([user, authenticate(agent, mocked)]))
    .then(([user]) => Promise.all([agent, user, mocked.password]))
};

module.exports = {
  authenticate,
  signupAndAuthenticate
};
