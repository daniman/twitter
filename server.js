var express = require('express');
var app = express();

var monk = require('monk');

var connection_string = 'localhost/twitter';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/twitter';
}

var db = monk(connection_string);

app.get('/', function(req, res) {
    db.get('stuff').insert({'test': 'tested'}, function(e, doc) {
        db.get('stuff').find({}, function(e, docs) {
            res.writeHead(200, {"Content-Type": "text/plain"});
            for (var i = 0; i < docs.length; ++i)
                res.write("#" + i + ": " + docs[i].test + "\n");
            res.end();
        });
    });
});

var port = process.env.OPENSHIFT_NODEJS_PORT;
var ip = process.env.OPENSHIFT_NODEJS_IP;

app.listen(port || 8080, ip);
