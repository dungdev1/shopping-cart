const passport = require('passport');
const User = require('../models/user');
const LocalStratery = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
});

passport.use('local.signup', new LocalStratery({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({email: email}, function(err, user) {
    if (err) return done(err);
    if (user) return done(null, false, {message: 'Email is already in use'});
    let newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result) {
      if (err) return done(err);
      return done(null, result);
    })
  })
}
));

passport.use('local.signin', new LocalStratery({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  User.findOne({email: email}, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, {message: 'No user found.'});
    if (!user.validPassword(password)) return done(null, false, {message: 'Password not match'});
    return done(null, user);
  })
}))