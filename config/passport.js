const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = require('./../models/model.user');
const keys = require("../config/keys");
const LocalStrategy = require("passport-local").Strategy;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );




passport.use(
  new LocalStrategy(
      {
          emailField: "email"
      },
      async (email, password, done) => {
          try {
              // Find the user given the email
              const user = await User.findOne({ "email": email });
              // If not, handle it
              if (!user) {
                  return done(null, false);
              }
              // Check if the password is correct
              const isMatch = await user.isValidPassword(password);
              // If not, handle it
              if (!isMatch) {
                  return done(null, false);
              }
              // Otherwise, return the user
              done(null, user);
          } catch (error) {
              done(error, false);
          }
      }
  )
);



};