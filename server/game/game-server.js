const util = require('./util');
const config = require('../../config.json');
const matter = require('p2');

module.exports = class ServerGame {
  constructor() {
    this.players = [];
    this.platforms = []
    this.leaderboard = [];
    this.leaderboardChanged = false;
  }

  removePlayer(player) {
    const playerIndex = game.players.indexOf(player);
    if (playerIndex > -1) {
      game.players.splice(playerIndex, 1);
    }
  }

  addPlayer(socket, name) {
    // We could eventually have a weighted random so weak players don't spawn too close to strong players
    const position = {
      x: util.randomInt(config.game.mapWidth),
      y: util.randomInt(config.game.mapHeight),
    }
    //TODO update to physics thing
    const player = {
      socket: socket,
      name: name,
      x: position.x,
      y: position.y,
      radius: 10,
      hue: Math.round(Math.random() * 360),
      grapple: { x: position.x, y: position.y, },
      target: { x: 0, y: 0, },
    }

    this.players.push(player);
    return player;
  }

  sendUpdates() {
    for (let player of this.players) {
      console.log(`sending updates to ${player.name}`);
    }
  }
}
