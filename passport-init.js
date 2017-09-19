var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {

    console.log('serializing user:', user._id);
    return done(null, user._id);
  });


  passport.deserializeUser(function (id, done) {

    User.findById(id, function (err, user) {
      // if (err) {
      return done(err, user);
      // }
      // if (!user) {
      //   return done('user not found', false);
      // }
      // return done(user, true);
    });
  });


  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  },
    function (req, username, password, done) {

      User.findOne({ 'username': username },
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done('user ' + username + 'not found!', false);
          }

          if (!isValidPassword(user, password)) {
            return done('incorrect password', false);
          }

          return done(null, user);
        }
      );
    }
  ));

  //   if (isValidPassword(users[username], password)) {
  //     return done(null, users[username]);
  //   }
  //   else {
  //     console.log('Invalid password');
  //     return done(null, false);
  //   }
  // }


  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
    function (req, username, password, done) {

      User.findOne({ 'username': username }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done('username already taken', false);
        } else {
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);



          newUser.save(function (err) {
            if (err) {
              return done(err, false);
            }
            console.log('successfully signed up user ' + username);

            return done(null, newUser);
          });
        }
      });
    })
  );

  var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
  };

  var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
};
