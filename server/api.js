'user strict';

const express = require('express');
const bodyParser = require('body-parser');
const api = express();

const server = require('http').createServer(api);
const io = require('socket.io')(server);
server.listen(3002);

api.use(bodyParser.json());

io.on('connection', (socket) => {
  console.log('A user connected!');
  socket.emit('test', {test: 'stuff'});
  socket.on('pingcheck', () => {
    socket.emit('pongcheck');
  });
});

module.exports = api;
