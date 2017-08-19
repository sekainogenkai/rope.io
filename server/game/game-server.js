const util = require('./util');
const config = require('../../config.json');
const p2 = require('p2');

module.exports = class GameServer {
  constructor() {
    this.users = [];
    this.platforms = [];
    this.sockets = {};
    this.leaderboard = [];
    this.leaderboardChanged = false;
    // P2 engine
    this.world = new p2.World({
      gravity:[0, -9.82],
    });
    // Create an infinite ground for testing
    const ground = new p2.Body({
      mass: 0 // Setting mass to 0 makes it static
    });
    const plane = new p2.Plane();
    ground.addShape(plane);
    this.world.addBody(ground);
  }

  removeUser(user) {
    const userIndex = this.users.indexOf(user);
    if (userIndex > -1) {
      delete this.sockets[user.id];
      this.users.splice(userIndex, 1);
    }
  }

  addUser(socket, name) {
    // We could eventually have a weighted random so weak users don't spawn too close to strong users
    // create the physics body
    const body = new p2.Body({
      mass: 5,
      position: [util.randomInt(config.game.mapWidth), util.randomInt(config.game.mapHeight)]
    });
    // make the shape
    const shape = new p2.Circle({ radius: config.game.userSize});
    body.addShape(shape);
    // add the body to the world
    this.world.addBody(body);

    // define a user to keep track of stuff
    const user = {
      id: socket.id,
      name: name,
      radius: 10,
      hue: Math.round(Math.random() * 360),
      body: body,
      target: { x: 0, y: 0, },
    }

    this.users.push(user);
    this.sockets[user.id] = socket;
    return user;
  }

  update(deltaTime) {
    this.world.step(1/config.game.fixedTimeStep, deltaTime, config.game.maxSubSteps);
  }

  sendUpdates() {
    for (let user of this.users) {
      // TODO this will obviously change
      const userData = this.users.map(u => {
        return {
          id: u.id,
          name: u.name,
          radius: u.radius,
          hue: u.hue,
          position: u.body.position,
          target: u.target,
        }
      });

      this.sockets[user.id].emit('update', userData);
    }
  }
}
