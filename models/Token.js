const mongoose = require('mongoose');
ObjectId = require("mongodb").ObjectId;

const TokenSchema = new mongoose.Schema({
    accessToken: String,
	accessTokenExpiresAt: Date,
	refreshToken: String,
	refreshTokenExpiresAt: Date,
	client: Object,
	user: Object
});

const Token = mongoose.model('Token', TokenSchema);

module.exports = Token;