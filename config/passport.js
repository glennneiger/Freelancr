const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const OAuth2Strategy = require('passport-oauth2');
//Load user model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            //Match user
            User.findOne({ email: email})
              .then(user => {
                  if(!user) {
                      return done(null, false, {message: 'Email is not registered. Please sign up to log in.'});
                  }

                  //Match password
                  bcrypt.compare(password, user.password, (err, isMatch) => {
                      if(err) throw err;
                      if(isMatch) {
                        return done(null, user);
                      }
                      else{
                        return done(null, false, {message: 'Password is incorrect'});
                      }
                  });
              })
              .catch(err => console.log(err));
        })
    );

    passport.use(new OAuth2Strategy({
        authorizationURL: '../auth',
        tokenURL: '../oauth/token',
        clientID: '455583265488-akie1hn4u95a4cv15ehm651pdidprd47.apps.googleusercontent.com',
        clientSecret: 'atVe2L_-NjGv6Nh63xbHpKa7',
        callbackURL: "https://oauth-redirect.googleusercontent.com/r/testingwebhooks-anchos"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}

