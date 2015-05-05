/**
 * This module deals with all the routing
 */

var express = require('express');
var mongoose = require('mongoose');
var models = require('./models');
var User = models.User;
var Chat = models.Chat;
var invalid = require('./util/invalid');
var crypto = require('crypto');
var hash = require('./util/hash')
var async = require('async')

module.exports = function (app) {
	
	/** Signup Routing */
	app.get('/signup', function (req, res) {
		res.render('signup.jade', {pageTitle: 'Sign Up'});
	});
	app.post('/signup', function (req, res, next) {
		User.findOne({'_id': req.body._id}, function (err, user) {
			if (err) {
				next(err);
			} else if (user) {
				res.render('signup.jade', {exists: true});
			} else if (invalid(req.body.email)) {
				res.render('signup.jade', {invalid: true});
			} else {
				crypto.randomBytes(16, function (err, bytes) {
					if (err) {
						next(err);
					} else {
						var config = {'_id': req.body._id, 'email': req.body.email};
						config.salt = bytes.toString('utf8');
						config.hash = hash(req.body.pass, config.salt);
						
						var user = new User(config);
						user.save(function (err, user) {
							if (err) {
								next(err);
							} else {
								req.session.isLoggedIn = true;
								req.session.userid = user._id;
								console.log("[MongoDB] Created user: %s\n", user._id);
								res.redirect('/');
							}
						});
					}
				});
			}
		})
	});
	
	/** Login Routing */
	app.get('/login', function (req, res) {
		res.render('login.jade', {pageTitle: 'Log In'});
	});
	app.post('/login', function (req, res, next) {
		if (req.body._id && req.body.pass) {
			var query = {'_id': req.body._id.toLowerCase()};
			User.findOne(query, function (err, user) {
				if (err) {
					next(err);
				} else if (user) {
					if (user.hash !== hash(req.body.pass, user.salt)) {
						res.render('login.jade', {incorrect: true});
					} else {
						req.session.isLoggedIn = true;
						req.session.userid = user._id;
						res.redirect('/');	
					}
				} else {
					res.render('login.jade', {notExists: true});
				}
			});
		} else {
			res.render('login.jade', {empty: true});
		}
	});
	
	/** Homepage Routing */
	app.get('/', function (req, res, next) {
		if (req.session.isLoggedIn) {
			User.findOne({'_id': req.session.userid}, function (err, user) {
				if (err) {
					next(err);
				} else {
					res.render('home.jade', {chatids: user.chat, pageTitle: 'Home'});
				}
			});
		} else {
			res.render('home.jade');
		}
	});
	
	/** Logout Routing */
	app.get('/logout', function (req, res) {
		req.session.isLoggedIn = false;
		req.session.userid = null;
		res.redirect('/');
	});
	
	/** Chat Routing */
	app.get('/chat/:chatid', function (req, res, next) {
		if (req.session.isLoggedIn) {
			req.session.chatid = req.params.chatid;
			Chat.findOne({'_id': req.params.chatid}, function (err, chat) {
				if (err) {
					next(err);
				} else {
					res.render('chat.jade', {messages: chat.messages, pageTitle: 'Chat'});
				}
			});	
		} else {
			res.render('chat.jade');
		}
	}); 
	 
	app.post('/chat', function (req, res, next) {
		if (req.body.receivers) {
			var members = req.body.receivers.split(',');
			for (var i = 0; i < members.length; i++) {
				members[i] = members[i].trim();
			}
			async.map(members, function (member, callback) {
				User.findOne({'_id': member}, callback);
			}, function (err, users) {
				if (err) {
					next(err);
				} else {
					for (var i = 0; i < users.length; i++) {
						if (!users[i]) {
							return res.render('home.jade', {notExist: true});
						}
						if (users[i]._id === req.session.userid) {
							return res.render('home.jade', {selfError: true});
						}
					}
					members.push(req.session.userid);
					var chat = new Chat({
						messages: [],
						members: members
					});
					chat.save(function (err, new_chat) {
						if (err) {
							next(err);
						} else {
							console.log("[MongoDB] new chat created: %s\n", new_chat._id);
							async.map(members, function (member, callback) {
								User.findOneAndUpdate({'_id': member}, {
									'$push': {chat: new_chat._id}
								}, callback);
							}, function (err, users) {
								if (err) {
									next(err);
								} else {
									res.redirect('/chat/' + new_chat._id);
								}
							});
						}
					});
				}
			});
		}
	});
	
	/** Default Routing */
	app.use(express.static(__dirname));
	
};