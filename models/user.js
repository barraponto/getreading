const mongoose = require('../mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const UserSchema = mongoose.Schema({
  email: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  library: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
});

UserSchema.pre('save', function(next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(config.SALT_WORK_FACTOR)
      .then((salt) => bcrypt.hash(user.password, salt))
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.methods.addBook = function(book) {
  // @TODO: findByIdAndUpdate doesn't trigger middlewares (like pre-save).
  return User.findByIdAndUpdate(this.id, {$push: {library: book}}, {new: true});
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
