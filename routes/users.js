var express = require('express');
var router = express.Router();

module.exports = router;

/**
-- LOGIN PAGE --
get login: directs user to login form
post login: authenticates user, logs them in
**/
router.get('/login', function(req, res) {
  res.render('login', {title: "Login"});
});

router.post('/login', function(req, res) {
  	var users = req.User;
  	users.findOne({
  		'auth.username': req.body.username,
  		'auth.password': req.body.password
  	}, function(e, user){
  		if (e) {
  			res.redirect('/');
  		} else {
			if (user == null) {
				res.write('<p style="background-color: white">user not found</p>');
			} else {
				req.session.first = user.auth.first;
				req.session.last = user.auth.last;
				req.session.username = user.auth.username;
				req.session.user_id = user._id;
				res.redirect('/');
			}
		}
  	});
});

/**
-- NEW USER PAGE --
get new_user: directs user to a form where they can create an account
post new_user: logs user in, directs back to index
**/

router.get('/signup', function(req, res) {
  res.render('signup', {title: "Create New User"});
});

router.post('/signup', function(req, res, next) {
	var user = new req.User({
		auth: {
			first: req.body.first,
			last: req.body.last,
			username: req.body.username,
			password: req.body.password
		},
		follow: {
			following: [],
			followers: []
		},
		tweet: {
			tweets: [],
			retweets: [],
			favorites: []
		},
		isRetweet: undefined
	});
	user.save(function (err) {
		if (err) {
		  	console.log('meow');
		} else {
			req.session.username = req.body.username;
			req.session.user_id = user.id;
		  	res.redirect("/");
		}
	});
});