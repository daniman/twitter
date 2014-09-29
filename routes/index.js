var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var db = req.db;
  var tweets = db.get('tweets');
  tweets.find({}, function(e, docs){
  	res.render('index', { title: 'Fritter', 'tweets': docs });
  });
});

router.post('/tweet', function(req, res, next) {
	var db = req.db;
  	var tweets = db.get('tweets');
  	console.log(tweets);
	tweets.insert({"tweet": req.body.tweet}, function(err, docs){
		if(err){
			res.send("There was a problem");
		}else{
			res.redirect("/");
		}
	});
});

module.exports = router;
