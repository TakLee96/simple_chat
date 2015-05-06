/** 
 * This module enables socket connection for chatting
 * @author TakLee96 
 */

var Chat = require('./models').Chat;

module.exports = function (server) {
    var io = require('socket.io')(server);
    
    io.on('connection', function (client) {
        console.log('[Socket] New Socket Connection!\n');
        
        client.emit('connected');
        
        var chatid = null;
        
        client.on('join', function (id) {
            chatid = id;
            
            client.join(id, function (err) {
                if (err) {
                    console.error(err);
                }
                
                client.emit('joined');
            });
        });
        
        client.on('message', function (message) {
            Chat.findOneAndUpdate({'_id': chatid}, {
                '$push': {messages: {
                    sender: message.sender, 
                    date: message.date, 
                    msg: message.msg
                }}
            }, function (err) {
                if (err) {
                    console.error(err);
                }
                client.to(chatid).emit('message', message);
                client.emit('message', message);
            });
        });
    });
};
