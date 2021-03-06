/**
 * This module defines the user schema that lives in MongoDB
 * @author TakLee96
 */

var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    _id: {type: String, lowercase: true, trim: true, required: true},
    email: {type: String, lowercase: true, trim: true, required: true},
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    chat: [String]
});

var ChatSchema = mongoose.Schema({
    messages: [{
        sender: String,
        date: Date,
        msg: String
    }],
    members: [String]
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Chat: mongoose.model('Chat', ChatSchema)
};
