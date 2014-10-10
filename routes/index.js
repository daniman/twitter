var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

/**
-- INDEX PAGE --
shows tweets and user information
**/
router.get('/', function(req, res) {
	if (req.session.username == undefined) {
		req.session.username = false
	}
	var tweets = req.Tweet;
	var users = req.User;
	users.findOne({'auth.username': req.session.username}, function (err, user) {
		users.find({}, function (err, follows) {
			tweets.find({}).populate("author").exec({}, function (err, tweets) {
				res.render('index', {
					'title' : 'Fritter',
					'user' : user,
					'follows': follows, 
					'tweets': tweets
				});
			});
		})
	});
	
});

/**
-- FOLLOW USER --
adds new tweet text/user info to database
**/
router.post('/follow', function(req, res, next) {
	var users = req.User;
	users.update({'auth.username': req.session.username}, 
		{$push: {'follow.following': req.body.follow_id}}, 
		{upsert: true}, 
		function (err, user) {});
	users.update({'_id': req.body.follow_id}, 
		{$push: {'follow.followers': req.session.user_id}}, 
		{upsert: true}, 
		function (err, user) {});
  	res.redirect("/");	
});

/**
-- UNFOLLOW USER --
adds new tweet text/user info to database
**/
router.post('/unfollow', function(req, res, next) {
	console.log("unfollow request whipee!!!");
	var users = req.User;
	users.update({'auth.username': req.session.username}, 
		{$pull: {'follow.following': req.body.follow_id}}, 
		{upsert: true}, 
		function (err, user) {});
	users.update({'_id': req.body.follow_id}, 
		{$pull: {'follow.followers': req.session.user_id}}, 
		{upsert: true}, 
		function (err, user) {});
  	res.redirect("/");	
});

/**
-- POST NEW TWEET --
adds new tweet text/user info to database
**/
router.post('/tweet', function(req, res, next) {
	var tweet = new req.Tweet({
		author: req.session.user_id,
		favorites: [],
		retweets: [],
		text: req.body.tweet
	});
	tweet.save(function (err) {
		if (err) {
		  	console.log('meow');
		} else {
			var users = req.User;
			users.update({'auth.username': req.session.username}, 
				{$push: {'tweet.tweets': tweet.id}}, 
				{upsert: true}, 
				function (err, user) {});
		  	res.redirect("/");
		}
	});
});

/**
-- LOGOUT BUTTON --
logs user out on request (nullifies session)
**/
router.post('/logout', function(req, res, next) {
	req.session.username = undefined;
	req.session.first = undefined;
	req.session.last = undefined;
	req.session.user_id = undefined;
	res.redirect("/");
});

/**
-- FAVORITE TWEET --
adds new tweet text/user info to database
**/
router.post('/favorite', function(req, res, next) {
	var users = req.User;
	var tweets = req.Tweet;
	users.update({'auth.username': req.session.username}, 
		{$push: {'tweet.favorites': req.body.tweet_id}}, 
		function (err, user) {});
	tweets.update({'_id': req.body.tweet_id}, 
		{$push: {'favorites': req.session.user_id}}, 
		function (err, user) {});
  	res.redirect("/");	
});

/**
-- UNFAVORITE TWEET --
adds new tweet text/user info to database
**/
router.post('/unfavorite', function(req, res, next) {
	var users = req.User;
	var tweets = req.Tweet;
	users.update({'auth.username': req.session.username}, 
		{$pull: {'tweet.favorites': req.body.tweet_id}}, 
		function (err, user) {});
	tweets.update({'_id': req.body.tweet_id}, 
		{$pull: {'favorites': req.session.user_id}}, 
		function (err, user) {});
  	res.redirect("/");	
});


/**
-- DELETE TWEET --
**/
router.post('/delete', function(req, res, next) {
	tweets = req.Tweet;
	tweets.remove({
		'_id': mongo.ObjectID(req.body.tweet_id)
	}, function (err) {});
	var users = req.User;
	users.update({'auth.username': req.session.username}, 
		{$pull: {'tweet.tweets': req.body.tweet_id}}, 
		{upsert: true}, 
		function (err, user) {});
	res.redirect("/");
});

/**
-- EDIT TWEET --
**/
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