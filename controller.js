/**
 * This module process all the requests and responses for routes.js
 * @author TakLee96
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var hash = require('./util/hash');
var User = require('./model');

var controller = {};

/**
 * Check the availability of userid
 * @param req --- request object
 * @param res --- response object
 * @param next --- next middleware
 */
exports.isAvailable = function (req, res, next) {
    var userid = req.params.userid;
    User.findOne({'_id': userid}, function (err, user) {
       if (err) {
           next(err);
       } else if (user) {
           res.status(302).json({available: false});
           res.end();
       } else {
           res.status(200).json({avaibable: true});
           res.end();
       }
    });
};

/**
 * Create the user and respond
 * @param req --- request object
 * @param res --- response object
 * @param next --- next middleware
 */
exports.create = function (req, res, next) {
    crypto.randomBytes(16, function (err, bytes) {
        if (err) {
            next(err);
        } else {
            var userObject = {'_id': req.body._id, 'email': req.body.email};
            userObject.salt = bytes.toString('utf8');
            userObject.hash = hash(req.body.pass, userObject.salt);
            
            var user = new User(userObject);
            user.save(function (err, user) {
                if (err) {
                    next(err);
                } else {
                    // Advanced stuff
                }
            });
        }
    });
};

/**
 * Verify the password
 * @param req --- request object
 * @param res --- response object
 */
exports.verify = function (req, res) {
    // TODO
};
