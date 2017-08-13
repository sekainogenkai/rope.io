'user strict';

const express = require('express');
const bodyParser = require('body-parser');

const api = express();

const http = require('http').createServer(api);
const io = require('socket.io')(http);

http.listen(3000);
api.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('A user connected!');
  socket.emit('test', {test: 'stuff'});
  socket.on('pingcheck', function () {
    socket.emit('pongcheck');
  });
});

module.exports = api;
