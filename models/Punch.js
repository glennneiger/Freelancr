const mongoose = require('mongoose');

const PunchSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    in_time: {
        type: Date,
        required: true
    },
    out_time: {
        type: Date
    },
    time_total: {
        type: Number
    },
    is_complete: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Punch = mongoose.model('Punch', PunchSchema);

module.exports = Punch;