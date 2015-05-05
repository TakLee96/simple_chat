/**
 * This module handles errors that could occur for the express app
 * @author TakLee96
 */

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.status(404).end("Page not found!");
	});

	app.use(function (err, req, res, next) {
		console.log("[Server] Error occurred: %s", error.stack);
		res.status(500).end("Oops... The programmer screws up something!");
	});
};