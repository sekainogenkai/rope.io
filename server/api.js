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
  let currentUser;

  socket.on('join', (name) => {
    currentUser = game.addUser(socket, name);
    console.log(`${name} joined the game!`);
    console.log('users: ', game.users.map(user => user.name));
  });

  socket.on('disconnect', () => {
    game.removeUser(currentUser);
    console.log(`${currentUser.name} disconnected`);
    socket.broadcast.emit('userDisconnect', { name: currentUser.name });
  });

  socket.on('pingcheck', () => {
    socket.emit('pongcheck');
  });
});

// TODO find source for this code so I can credit that person
const tickLength = 1000 / config.game.fixedTimeStep;
let previousTick = Date.now();
const gameLoop = () => {
  const now = Date.now();
  if (previousTick + tickLength <= now) {
    const deltaTime = (now - previousTick)/1000;
    previousTick = now;
    game.update(deltaTime);
    //console.log(`delta: ${deltaTime}, target: ${tickLength}ms`)
  }

  if (now - previousTick < tickLength - 16) {
    setTimeout(gameLoop);
  } else {
    setImmediate(gameLoop);
  }
}
gameLoop();

setInterval(() => game.sendUpdates(), 1000/config.api.networkUpdate);

module.exports = api;
