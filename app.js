/// <reference path="typings/node/node.d.ts"/>
/**
 * The entry point of the project
 * @author TakLee96
 */

/** require necessary modules */
var express = require('express');
var mongoose = require('mongoose');

/** make connection to MongoDB */
mongoose.connect("mongodb://localhost/user_login", function (err) {
	if (err) {
		console.log("[MongoDB] Error connecting to MongoDB: %s", JSON.stringify(err));
	} else {
		/** instantiate express app */
		var app = express();
		
		/** use all necessary middlewares */
		require('./middlewares')(app);
		
		/** set up basic routing */
		require('./routes')(app);
		
		/** error handling */
		require('./errors')(app);
		
		/** launch the express app */
		app.listen(process.env.PORT || 8080, function () {
			console.log("[Server] Listening on port %s", this.address().port);
		});	
	}
});
