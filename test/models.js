const chai = require('chai');
const faker = require('faker');
const mongoose = require('../mongoose');
const config = require('../config');
const {User} = require('../models/user');

const should = chai.should();

describe('Test model', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  before('Clear database', () => mongoose.connection.dropDatabase());

  it('should save User and hash password', () => {
    const userData = {
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    return User.create(userData)
      .then((user) => {
        user.email.should.be.a('string');
        user.email.should.equal(userData.email);
        return user.checkPassword(userData.password);
      })
      .then((result) => result.should.be.true)
  });

});
