var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var clientModel = require('./models/Client'),
	tokenModel = require('./models/Token'),
    userModel = require('./models/User');
    
    var loadExampleData = function() {

        var client1 = new clientModel({
            clientId: 'application',
            clientSecret: 'secret',
            grants: [
                'password'
            ],
            redirectUris: []
        });
    
        var client2 = new clientModel({
            clientId: 'confidentialApplication',
            clientSecret: 'topSecret',
            grants: [
                'password',
                'client_credentials'
            ],
            redirectUris: []
        });

        client1.save(function(err, client) {

            if (err) {
                return console.error(err);
            }
            console.log('Created client', client);
        });

        client2.save(function(err, client) {

            if (err) {
                return console.error(err);
            }
            console.log('Created client', client);
        });
    }





    var getAccessToken = function(token) {

        return tokenModel.findOne({
            accessToken: token
        });
    };
    
    var getClient = function(clientId, clientSecret) {
        return clientModel.findOne({
            clientId: clientId,
            clientSecret: clientSecret
        });
    };
    
    var saveToken = function(token, client, user) {
        console.log("Is it thiss?");
        token.client = {
            id: client.clientId
        };
    
        token.user = {
            id: user.email || user.clientId
        };
    
        var tokenInstance = new tokenModel(token);
    
        tokenInstance.save();
    
        return token;
    };
    
    /*
     * Method used only by password grant type.
     */
    
    var getUser = function(email, password, callback) {
        console.log("got Here");
    
        userModel.findOne({
            email: email
        })
        .then(user => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                  callback(null, user);
                }
                else{
                  return false;
                }
            });
        })
        .catch(err => {
            console.log(err);
        });
    };
    
    /*
     * Method used only by client_credentials grant type.
     */
    
    var getUserFromClient = function(client) {
    
        return clientModel.findOne({
            clientId: client.clientId,
            clientSecret: client.clientSecret,
            grants: 'client_credentials'
        });
    };
    
    /**
     * Export model definition object.
     */
    
    module.exports = {
        getAccessToken: getAccessToken,
        getClient: getClient,
        saveToken: saveToken,
        getUser: getUser,
        getUserFromClient: getUserFromClient
    };