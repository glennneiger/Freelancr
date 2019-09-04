const mongoose = require('mongoose');
ObjectId = require("mongodb").ObjectId;

const ClientSchema = mongoose.Schema({
    clientId: String,
	clientSecret: String,
	grants: [String],
	redirectUris: [String]
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;