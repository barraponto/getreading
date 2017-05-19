const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const UserSchema = mongoose.Schema({
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
});

UserSchema.pre('save', (next) => {
  const user = this;
  if (!user.isModified('password')) { next(); }
  else {
    bcrypt.genSalt(config.SALT_WORK_FACTOR)
    .then((salt) => bcrypt.password(user.password, salt))
    .then((hash) => {user.password = hash; next();})
    .catch((err) => next(err));
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
