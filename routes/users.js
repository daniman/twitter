var express = require('express');
var router = express.Router();

module.exports = router;

/**
-- LOGIN PAGE --
get login: directs user to login form
post login: authenticates user, logs them in
**/
router.get('/login', function(req, res) {
  res.render('users/login_form', {title: "Login"});
});

router.post('/login', function(req, res) {
  	var users = req.db.get('users');
  	users.findOne({
  		'username': req.body.username,
  		'password': req.body.password
  	}, function(e, docs){
  		if (e) {
  			res.redirect('/');
  		} else {
			if (docs == null) {
				res.write('<p>user not found</p>');
			} else {
				req.session.first = docs.first;
				req.session.last = docs.last;
				req.session.username = docs.username;
				req.session.user_id = docs._id;
				res.redirect('/');
			}
		}
  	});
});

router.get('/new_user', function(req, res) {
  res.render('users/new_user', {title: "Create New User"});
});

// TODO: Check that there are not multiple users with the same username
router.post('/new_user', function(req, res, next) {
	var users = req.db.get('users');
	var id = users.insert({
		"first": req.body.first,
		"last": req.body.last,
		"username": req.body.username,
		"password": req.body.password
	}, function(err, docs){
			if(err){
				res.write('<p>There was a problem :(</p>');
			}else{
				req.session.first = docs.first;
				req.session.last = docs.last;
				req.session.username = docs.username;
				req.session.user_id = docs._id;
				res.redirect("/");
			}
	});

});