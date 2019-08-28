const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
const http = require('http').createServer(app);
var io = require('socket.io')(http);

//passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to DB
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
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


const PORT = process.env.PORT || 8080;

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('date selected', function(date) {
        console.log(date);
        io.emit('date selected', date);
    });
});



http.listen(PORT, console.log(`Server started on ${PORT}`));
