/**
 * Returns whether the email is invalid
 * @author TakLee96
 */

var validator = require('email-validator');

module.exports = function (email) {
    return !validator.validate(email);
};