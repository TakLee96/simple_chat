/// <reference path="typings/node/node.d.ts"/>
/**
 * The entry point of the project user_login
 * The project uses MongoDB to store user information and session information
 * and uses Jade to render the front end page
 * @author TakLee96
 */

/** require necessary modules */
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');

/** make connection to MongoDB */
var mongolab = "mongodb://heroku_app36574142:ujf3e0bl6iarapciocuodio7q3@ds031842.mongolab.com:31842/heroku_app36574142";
var local = "mongodb://localhost/user_login";

mongoose.connect(mongolab, function (err) {
    if (err) {
        console.log("[MongoDB] Error connecting to MongoDB: %s", JSON.stringify(err));
    } else {
        /** instantiate express app */
        var app = express();
        var server = http.createServer(app);
        
        /** establish socket.io connection */
        require('./socket')(server);
        
        /** use all necessary middlewares */
        require('./middlewares')(app);
        
        /** set up basic routing */
        require('./routes')(app);
        
        /** error handling */
        require('./errors')(app);
        
        /** launch the express app */
        server.listen(process.env.PORT || 8080, function () {
            console.log("[Server] Listening on port %s", this.address().port);
        });    
    }
});
