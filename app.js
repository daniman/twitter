// node package dependencies
var express = require('express');
var session = require('express-session')
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');

// openshift dependencies
var connection_string = 'localhost/twitter';
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/twitter';
}

// instantiate db, routes, and users
var db = monk(connection_string);
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// instantiate sessions
app.use(session({
    secret: 'keyboard cat'
}))

// make db available to requests
app.use(function(req,res,next){
    req.db = db;
    req.mongo = mongo;
    next();
});

app.use('/users', users);
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