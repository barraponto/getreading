const chai = require('chai');
const mongoose = require('../mongoose');
const config = require('../config');
const {User} = require('../models/user');

const should = chai.should();

describe('Test model', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  before('Clear database', () => mongoose.connection.dropDatabase());

  it('should save a new User', () =>
    User.create({email: 'email@domain.tld', password: 'password'})
      .then((user) => {
        user.email.should.be.a('string');
        user.email.should.equal('email@domain.tld');
      })
  );

});
