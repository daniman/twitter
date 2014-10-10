// node package dependencies
var express = require('express');
var session = require('express-session')
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var logger = require('morgan');

// var monk = require('monk');
var mongoose = require('mongoose');

// openshift dependencies
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/twitter';
}

// instantiate db, routes, and users
// var db = monk(connection_string);
mongoose.connect('localhost/twitter');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    // yay!
})

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// instantiate sessions
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

var Tweet = require('./models/tweets');
var User = require('./models/users');

// make db available to requests
app.use(function(req,res,next){
    req.Tweet = Tweet;
    req.User = User;
    next();
});

app.use('/', users);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
ERROR HANDLERS
**/

// development error
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;