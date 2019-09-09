const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const OAuth2Server = require('oauth2-server')

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

router.get('/googleLogin', (req, res) => res.render('googleLogin'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

//Register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    if(password.length < 6) {
        errors.push({ msg: 'Passwords must be at least 6 characters in length'});
    }

    if(errors.length > 0 ) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else {
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                //User exists
                errors.push({ msg: "A user with this email already has an account."});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
              const newUser = new User({
                name,
                email,
                password
              });

              //hash password
              bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    //set passwd to hashed passwd
                    newUser.password = hash;
                    //save user
                    newUser.save()
                      .then(user => {
                          req.flash('success_msg', 'You are now registered. Please log in.');
                          res.redirect('/users/login');
                      })
                      .catch(err => console.log(err));
                }
              ));
            }
        });
    }
});

// Login handle
router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.post('/googleLogin', (req, res, next) => {
    passport.authenticate('oauth2');
});

//Logout handle
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', 'Successfully logged out');
    res.redirect('/users/login');
});



module.exports = router;
