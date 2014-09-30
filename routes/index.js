var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var db = req.db;
  var tweets = db.get('tweets');
  if (req.session.username == undefined) {
  	req.session.username = false
  }
  tweets.find({}, function(e, docs){
  	res.render('index', {
  		title: 'Fritter',
  		'tweets': docs,
  		'username': req.session.username,
  		'first': req.session.first,
  		'last': req.session.last,
  		'user_id': req.session.user_id
  	});
  });
});

router.post('/tweet', function(req, res, next) {
  	var tweets = req.db.get('tweets');
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
	req.session.username = undefined;
	req.session.first = undefined;
	req.session.last = undefined;
	req.session.user_id = undefined;
	res.redirect("/");
});

router.post('/delete', function(req, res, next) {
	var tweets = req.db.get('tweets');
	tweets.remove({
		'_id': new req.mongo.ObjectID(req.body.tweet_id)
	});
	res.redirect("/");
});

router.post('/edit', function(req, res, next) {
	req.session.tweet_id = req.body.tweet_id;
	res.redirect("/edit_tweet");
});

router.get('/edit_tweet', function(req, res) {
	if (req.session.username == false) {
	  	res.redirect("/");
	}
	var tweets = req.db.get('tweets');
	tweets.findOne({
	  	'_id': new req.mongo.ObjectID(req.session.tweet_id)
	}, function(e, docs){
	  	console.log(docs);
	  	res.render('edit_tweet', {
	  		title: 'Fritter',
	  		'tweet': docs.tweet
	  	});
	});
});

router.post('/edited_tweet', function(req, res, next) {
	console.log("trying to save edited tweet..................................................");
	console.log("TWEET: " + req.body.tweet);

	var tweets = req.db.get('tweets');
	tweets.update({
	  	'_id': new req.mongo.ObjectID(req.session.tweet_id)
	}, { $set:{
		'tweet': req.body.tweet
	}});

	req.session.tweet_id = null;
	res.redirect("/");

});



module.exports = router;