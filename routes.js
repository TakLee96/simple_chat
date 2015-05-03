/**
 * This module deals with all the routing
 */
var controller = require('./controller');

module.exports = function (app) {
	
	/** check availability of userid */
	app.get('/users/:userid', controller.isAvailable);
	
	/** create new user with userid */
	app.post('/users', controller.create);
	
	/** varify password with userid */
	app.post('/users/:userid', controller.verify);
	
};