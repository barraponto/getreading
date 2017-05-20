const config = {
  SECRET: '4', // rolled dice, must be random
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/getreading'
}

if (process.env.NODE_ENV === 'testing') {
  Object.assign(config, {
    MONGODB_URL: 'mongodb://localhost/getreading-test'
  });
}

module.exports = config;
