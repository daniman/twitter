var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	author: {type: String, ref: 'User'},
	favorites: [{ type: String, ref: "User"}],
	retweets: [{ type: String, ref: "User"}],
	text: String
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;