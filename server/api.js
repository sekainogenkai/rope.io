'user strict';

const express = require('express');
const bodyParser = require('body-parser');
const api = express();

api.use(bodyParser.json());

const server = require('http').createServer(api);
const io = require('socket.io')(server);
server.listen(3002);

const config = require('../config.json');
const Game = require('./game/game-server');
const game = new Game();

io.on('connection', (socket) => {
  console.log('a new user connected!');
  let currentPlayer;

  socket.on('join', (name) => {
    currentPlayer = game.addPlayer(socket, name);
    console.log(`${name} joined the game!`);
    console.log('players: ', game.players.map(player => player.name));
  });

  socket.on('disconnect', () => {
    game.removePlayer(currentPlayer);
    console.log(`${name} disconnected`);
    socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
  });

  socket.on('pingcheck', () => {
    socket.emit('pongcheck');
  });
});

setInterval(() => game.sendUpdates(), 1000 / config.api.networkUpdate);

module.exports = api;
