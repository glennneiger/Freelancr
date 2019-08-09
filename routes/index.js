const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Punch = require('../models/Punch');
const User = require('../models/User');

//Welcome page
router.get('/', (req, res) => res.render('welcome'));

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => 
res.render('dashboard', {
    user: req.user
}));
router.post('/clockIn', (req, res) => {
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
            { $set: {clockedIn: true}},
            (err, res) => {
                console.log("Document updated");
            }

        );
    });
    
});
router.post('/clockOut', (req, res) => {
    console.log('made it here');
    console.log(req.user);
    Punch.findOne({userID: req.user._id, is_complete: false}, (err, punch) => {
        Punch.updateOne(
            {userID: req.user._id},
            { $set: {out_time: Date.now(),
                    time_total: Date.now()-punch.in_time,
                    is_complete: true}},
            (err, res) => {
                console.log("document updated");
            }

        )
        User.updateOne(
            { email: req.user.email },
            { $set: {clockedIn: false}},
            (err, res) => {
                console.log("Document updated");
            }

        );
    });
    
});

module.exports = router;
