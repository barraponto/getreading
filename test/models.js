const chai = require('chai');
const faker = require('faker');
const mongoose = require('../mongoose');
const config = require('../config');
const {User} = require('../models/user');

const should = chai.should();
const userData = {
  email: faker.internet.email(),
  password: faker.internet.password()
};

describe('Test model', () => {
  before('Connect mongoose', () => mongoose.connect(config.MONGODB_URL));
  before('Clear database', () => mongoose.connection.dropDatabase());

  it('should save User', () =>
    User.create(userData).then((user) => {
      user.email.should.be.a('string');
      user.email.should.equal(userData.email);
      userData.id = user.id;
    })
  );

  it('should check User pasword', () =>
    User.findById(userData.id)
      .then((user) => user.checkPassword(userData.password))
      .then((result) => result.should.be.ok)
  );
});
