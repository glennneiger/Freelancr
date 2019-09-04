const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var path = require('path');
const app = express(),
            OAuth2Server = require('oauth2-server'),
            Request = OAuth2Server.Request,
            Response = OAuth2Server.Response;

//passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to DB
console.log("test");
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//oAuth2.0
app.oauth = new OAuth2Server({
	model: require('./model'),
	accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true,
    debug: true
});

//EJS
app.use(expressLayouts);
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport mw
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//GLOBAL VARS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.all('/oauth/token', obtainToken);

app.get('/test', authenticateRequest, function(req, res) {
	res.send('Congratulations, you are in a secret area!');
});

app.set('views', path.join(__dirname, 'views')); 
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));

function obtainToken(req, res) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function(token) {

			next();
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}
