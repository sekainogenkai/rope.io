'user strict';

const express = require('express');
const bodyParser = require('body-parser');
const api = express();

const server = require('http').createServer(api);
const io = require('socket.io')(server);
server.listen(3002);

api.use(bodyParser.json());

//const util = require('./game/util');
const Game = require('./game/server-game');
const game = new Game();


io.on('connection', (socket) => {
  console.log('a new user connected!');
  let currentPlayer;

  socket.on('join', (name) => {
    currentPlayer = game.defaultPlayer(socket, name);
    console.log(`${name} joined the game!`);
    game.sockets[currentPlayer.id] = socket;
    game.players.push(currentPlayer);
    console.log('players: ', game.players.map(player => player.name));
  });

  socket.on('disconnect', () => {
    const playerIndex = game.players.indexOf(currentPlayer);
    if (playerIndex > -1) {
      game.players.splice(playerIndex, 1);
    }
    console.log(`${name} disconnected`);
    socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
  });

  socket.on('pingcheck', () => {
    socket.emit('pongcheck');
  });
});

module.exports = api;
