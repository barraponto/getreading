const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const {User} = require('./models/user');

passport.use(new LocalStrategy(
  {usernameField: 'email', passwordField: 'password'},
  (email, password, done) => User.findOne({email})
    .then((user) => Promise.all([user, user ? user.checkPassword(password) : false]))
    .then(([user, validated]) => (user && validated) ? done(null, user) : done(null, false))
    .catch((err) => done(err, false))
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((userID, done) => done(null, userID));

module.exports = {passport};
