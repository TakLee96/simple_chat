/**
 * This is the front end implementation with Socket.io and jQuery
 * @author TakLee96
 */

/* global io */
/* global userid */
/* global chatid */

$(document).ready(function () {
    var socket = io();
    
    socket.on('connected', function () {
        console.log('Connection Established!');
        
        socket.emit('join', chatid);
        
        socket.on('joined', function () {
            $('#send').on('click', function () {
                var msg = $('#msg').val();
                if (msg) {
                    $('#msg').val('');
                    socket.emit('message', {
                        'sender': userid, 
                        'date': new Date(), 
                        'msg': msg
                    });
                }
            });
            
            socket.on('message', function (message) {
                var direction = (message.sender === userid) ? 'send' : 'receive';
                var sender = (message.sender === userid) ? 'Me' : message.sender;
                $('#messages').append("<li class='msg " + direction + "'>" + sender + ": " + message.msg + " [" + message.date + "]</li>");
            });                
        });
    });
});