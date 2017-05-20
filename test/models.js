const chai = require('chai');
const mongoose = require('../mongoose');
const config = require('../config');
const mock = require('./mock');
const {User} = require('../models/user');

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

  after('Clear database', () => mongoose.connection.dropDatabase());
  after('Disconnect mongoose', () => mongoose.disconnect());
});
