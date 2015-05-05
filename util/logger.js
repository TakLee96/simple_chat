/**
 * A very basic implementation of an express logger middleware
 * @author TakLee96
 */

var logger = function (req, res, next) {
	var start = +new Date();
	res.on('finish', function () {
		var end = +new Date();
		console.log("[Server] %s %s\nComplete in %sms\n", req.method, req.url, end-start);
	});
	next();
};

module.exports = function () {
	return logger;
};