/**
 * This module defines the user schema that lives in MongoDB
 * @author TakLee96
 */

var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	_id: {type: String, lowercase: true, trim: true, required: true},
	email: {type: String, required: true},
	salt: {type: String, required: true},
	hash: {type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema);
