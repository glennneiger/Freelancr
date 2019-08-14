const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Punch = require('../models/Punch');
const User = require('../models/User');
ObjectId = require("mongodb").ObjectId

//Welcome page
router.get('/', (req, res) => res.render('welcome'));

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        user: req.user
    }
));
router.get('/reports', ensureAuthenticated, (req, res) => 
    res.render('reports', {
        user: req.user
    }
));
router.post('/clockIn', (req, res, next) => {
    console.log('made it here');
    console.log(req.user);
    User.findOne({email: req.user}, (err, user) => {
        const newPunch = new Punch({
            userID: req.user._id,
            in_time: Date.now()
        });
        newPunch.save((err) => {
            console.log(err);
            res.send(user);
        });
        User.updateOne(
            { email: req.user.email },
            { $set: {clockedIn: true,
                     activePunchID: new ObjectId(newPunch._id)}},

            (err, res) => {
                console.log("Document updated");
            }

        );
    });
    req.flash('success_msg', 'Successfully clocked in.');
    next();

});
router.post('/clockOut', (req, res, next) => {
    console.log('made it here');
    console.log(req.user);
    
    Punch.findOne({_id: req.user.activePunchID}, (err, punch) => {
        Punch.updateOne(
            
            {_id: req.user.activePunchID},
            { $set: {out_time: Date.now(),
                    time_total: Date.now()-punch.in_time,
                    is_complete: true}},
            (err, res) => {
                console.log("document updated");
            }

        )
        User.updateOne(
            { email: req.user.email },
            { $set: {clockedIn: false, activePunchID: null}},
            (err, res) => {
                console.log("Document updated");
            }

        );
    });
    req.flash('success_msg', 'Successfully clocked out.');
    next();
    
});

module.exports = router;
