var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var users = {};
module.exports = function (passport) {

  passport.serializeUser(function (user, done) {

    console.log('serializing user:', user.username);
    return done(null, user.username);
  });

  passport.deserializeUser(function (username, done) {
    return done(null, users[username]);
  });

  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  },
    function (req, username, password, done) {
      if(!user[username]) {
        return done('user not found', false);
      }

      if(!isValidPassword(users[username], password)){
        return done('invalid password', false);
      }
      console.log('successfully signed in');
      return done(null, users[username]);
    }

  ));

  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
    function (req, username, password, done) {

      if (users[username]) {
        return done('username already taken', false);
      }

      users[username] = {
        username: username,
        password: createHash(password)
      };
      return done(null, users[username]);
    })
  );

  var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
  };

  var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
};
