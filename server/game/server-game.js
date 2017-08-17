const util = require('./util');
const matter = require('matter-js');

module.exports = class ServerGame {
  constructor() {
    this.players = [];
    this.food = [];
    this.platforms = [];
    this.sockets = {};
    this.leaderboard = [];
    this.leaderboardChanged = false;
  }

  defaultPlayer(socket, name) {
    // We could eventually have a weighted random so weak players don't spawn too close to strong players
    const position = {
      x: util.randomInt(util.MAP_WIDTH),
      y: util.randomInt(util.MAP_HEIGHT),
    }
    //TODO update to physics thing
    return {
      id: socket.id,
      name: name,
      x: position.x,
      y: position.y,
      radius: 10,
      hue: Math.round(Math.random() * 360),
      grapple: {
        x: position.x,
        y: position.y,
      },
      target: {
        x: 0,
        y: 0,
      },
    }
  }
}
