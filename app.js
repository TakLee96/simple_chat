/// <reference path="typings/node/node.d.ts"/>
/**
 * The entry point of the project
 * @author TakLee96
 */

/** require necessary modules */
var express = require('express');
var logger = require('./util/logger');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/** instantiate express app */
var app = express();

/** use all necessary middlewares */
app.use(logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/** set up basic routing */
require('./routes')(app);

/** error handling */
app.use(function (req, res, next) {
	res.status(404).end("Page not found!");
});

app.use(function (err, req, res, next) {
	console.log("[Server] Error occurred: %s", error.stack);
	res.status(500).end("Oops... The programmer screws up something!");
});

/** make connection to MongoDB */
mongoose.connect("mongodb://localhost/user_login", function (err) {
	if (err) {
		console.log("[MongoDB] Error connecting to MongoDB: %s", JSON.stringify(err));
	} else {
		/** launch the express app */
		app.listen(process.env.PORT || 8080, function () {
			console.log("[Server] Listening on port %s", this.address().port);
		});	
	}
});
