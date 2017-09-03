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
    // Create an infinite ground for testing//////////
    const ground = new p2.Body({
      mass: 0 // Setting mass to 0 makes it static
    });
    const plane = new p2.Plane();
    ground.addShape(plane);
    this.world.addBody(ground);
    ///////////////////////////////////////////////////
  }

  removeUser(user) {
    const userIndex = this.users.indexOf(user);
    if (userIndex > -1) {
      this.sockets[user.id].broadcast.emit('userDisconnect', { name: user.name });
      delete this.sockets[user.id];
      this.users.splice(userIndex, 1);
    }
  }

  addUser(socket, name) {
    // We could eventually have a weighted random so weak users don't spawn too close to strong users
    // create the physics body
    const body = new p2.Body({
      mass: config.game.player.mass,
      position: [util.randomInt(config.game.mapWidth), util.randomInt(config.game.mapHeight)]
    });
    // make the shape
    const shape = new p2.Circle({ radius: config.game.player.size});
    body.addShape(shape);
    // add the body to the world
    this.world.addBody(body);

    // define a user to keep track of stuff
    const user = {
      id: socket.id,
      name: name,
      color: util.randomColor(),
      body: body,
    }

    this.users.push(user);
    this.sockets[user.id] = socket;
    socket.broadcast.emit('addPlayer', {
      id: user.id,
      name: user.name,
      color: user.color,
      state: {
        position: user.body.position,
        velocity: user.body.velocity,
      },
    });
    socket.emit('start', this.users.map(u => {
      return {
        id: u.id,
        name: u.name,
        color: u.color,
        state: {
          position: user.body.position,
          velocity: user.body.velocity,
        },
      }
    }));
    return user;
  }

  update(deltaTime) {
    this.world.step(1/config.game.fixedTimeStep, deltaTime, config.game.maxSubSteps);
  }

  sendUpdates() {
    for (let user of this.users) {
      // TODO this will obviously change
      const visibleUsers = this.users.map(u => {
        return {
          id: u.id,
          state: {
            position: u.body.position,
            velocity: u.body.velocity,
          },
        }
      });
      this.sockets[user.id].emit('update', visibleUsers);
    }
  }
}
