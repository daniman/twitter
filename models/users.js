var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	auth: {
		first: String,
		last: String,
		username: String,
		password: String
	},
	follow: {
		following: [{ type: String, ref: "User"}],
		followers: [{ type: String, ref: "User"}],
	},
	tweet: {
		tweets: [{ type: String, ref: "Tweet"}],
		retweets: [{ type: String, ref: "Tweet"}],
		favorites: [{ type: String, ref: "Tweet"}],
	},
	isRetweet: mongoose.Schema.Types.Mixed
})

var User = mongoose.model('User', userSchema);

module.exports = User;