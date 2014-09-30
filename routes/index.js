var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var db = req.db;
  var tweets = db.get('tweets');

  if (req.session.username == undefined) {
  	req.session.username = false
  }

  console.log("NAME: " + req.session.name);

  tweets.find({}, function(e, docs){
  	res.render('index', {
  		title: 'Fritter',
  		'tweets': docs,
  		'username': req.session.username,
  		'first': req.session.first,
  		'last': req.session.last
  	});
  });
});

router.post('/tweet', function(req, res, next) {
	var db = req.db;
  	var tweets = db.get('tweets');
	tweets.insert({
		"tweet": req.body.tweet,
		"author": req.session.user_id,
		"author_first": req.session.first,
		"author_last": req.session.last,
		"author_username": req.session.username
	}, function(err, docs){
		if(err){
			res.send("There was a problem");
		}else{
			res.redirect("/");
		}
	});
});

router.post('/logout', function(req, res, next) {
	console.log("trying to log out...");
	req.session.username = undefined;
	req.session.first = undefined;
	req.session.last = undefined;
	req.session.user_id = undefined;
	res.redirect("/");
});

module.exports = router;