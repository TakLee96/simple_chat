/**
 * Compute the hash based on pass and salt
 * @author TakLee96
 */

var crypto = require('crypto');

/**
 * Compute the hash based on pass and salt
 * @param pass --- the password
 * @param salt --- the random bytes
 * @return the hashed password with sha512 algorithm and base64 digest
 */
module.exports = function (pass, salt) {
    var hash = crypto.createHash('sha512');
    hash.update(pass);
    hash.update(salt);
    return hash.digest('base64');
}