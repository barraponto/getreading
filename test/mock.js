const faker = require('faker');

const user = () => ({
  email: faker.internet.email(),
  password: faker.internet.password()
});

const book = () => ({
  title: faker.hacker.phrase(),
  author: faker.name.findName(),
  pages: faker.random.number({min: 50, max: 420})
});

module.exports = {book, user};
