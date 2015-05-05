var crypto = require('crypto');

module.exports = function (pass, salt) {
	var hash = crypto.createHash('sha512');
	hash.update(pass);
	hash.update(salt);
	return hash.digest('base64');
}