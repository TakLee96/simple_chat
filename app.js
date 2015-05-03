/// <reference path="typings/node/node.d.ts"/>
/**
 * The entry point of the project
 * @author TakLee96
 */

/** require necessary modules */
var express = require('express');
var logger = require('./logger');
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

/** make connection to MongoDB */
// TODO

/** launch the express app */
app.listen(process.env.PORT || 8080, function () {
	console.log("[Server] listening on port %s", this.address().port);
});