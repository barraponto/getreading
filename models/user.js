const mongoose = require('../mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const UserSchema = mongoose.Schema({
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
});

UserSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) { next(); }
  else {
    bcrypt.genSalt(config.SALT_WORK_FACTOR)
    .then((salt) => bcrypt.hash(user.password, salt))
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
  }
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User};
