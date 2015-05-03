/**
 * This module process all the requests and responses for routes.js
 * @author TakLee96
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var controller = {};

/**
 * Check the availability of userid
 * @param req --- request object
 * @param res --- response object
 */
controller.isAvailable = function (req, res) {
    var userid = req.params.userid;
    // TODO
};

/**
 * Create the user and respond
 * @param req --- request object
 * @param res --- response object
 */
controller.create = function (req, res) {
    // TODO
};

/**
 * Verify the password
 * @param req --- request object
 * @param res --- response object
 */
controller.verify = function (req, res) {
    // TODO
};

module.exports = controller;