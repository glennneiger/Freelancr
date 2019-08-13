const mongoose = require('mongoose');
ObjectId = require("mongodb").ObjectId
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    clockedIn: {
        type: Boolean,
        default: false
    },
    activePunchID: {
        type: ObjectId,
        default: new ObjectId("000000000000000000000000")
    }

});

const User = mongoose.model('User', UserSchema);

module.exports = User;