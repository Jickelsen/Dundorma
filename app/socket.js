var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');
var redis = new Redis(6379, 'redis');
var r = require('rethinkdb');

var connection = null;
r.connect( {host: '192.168.1.17', port: 28015}, function(err, conn) {
  if (err) throw err;
  connection = conn;
  r.db('homestead').table('test').changes().run(connection, function(err, cursor) {
    if (err) throw err;
    cursor.each((err, message) => {
      console.log("here its", message);
      io.emit('chatchannel:chatevent', message)});
  });
});


redis.subscribe('chat-channel', function(err, count) {

});

redis.on('message', function(channel, message) {
   console.log('Message Recieved: ' + message);

    message = JSON.parse(message);

    io.emit(channel + ':' + message.event, message.data);

});

http.listen(3000, function(){
    console.log('Listening on Port 3000');
});
