/**
 * This module deals with all the routing
 */

var express = require('express');
var mongoose = require('mongoose');
var User = require('./models');
var invalid = require('./util/invalid');
var crypto = require('crypto');
var hash = require('./util/hash')

module.exports = function (app) {
	
	app.get('/signup', function (req, res) {
		res.render('signup.jade');
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
	
	app.get('/login', function (req, res) {
		res.render('login.jade');
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
	
	app.get('/', function (req, res) {
		res.render('home.jade');
	});
	
	app.get('/logout', function (req, res) {
		req.session.isLoggedIn = false;
		req.session.userid = null;
		res.redirect('/');
	});
	
	app.use(express.static(__dirname));
	
};