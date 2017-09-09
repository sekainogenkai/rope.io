const util = require('./util');
const config = require('../../src/config.json');
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
      gravity: [0, -9.82],
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
      this.world.removeBody(this.users[userIndex].body);
      this.users.splice(userIndex, 1);
    }
  }

  addUser(socket, name) {
    // limit character count of the player name.
    name = name.substr(0, config.game.player.nameMaxCharCount);

    // We could eventually have a weighted random so weak users don't spawn too close to strong users
    // create the physics body
    // --------------------------------------
    const body = new p2.Body({
      mass: config.game.player.mass,
      position: [util.randomInt(config.game.mapSize[0]), util.randomInt(config.game.mapSize[1])],
    });
    // make the shape
    const shape = new p2.Circle({ radius: config.game.player.size });
    body.addShape(shape);
    // add the body to the world
    this.world.addBody(body);
    // --------------------------------------
    // make the grapple Circle
    const hook = new p2.Body({
      mass: config.game.player.rope.mass,
      position: [0, 0]
    });
    const hookShape = new p2.Circle({radios: config.game.player.rope.size });
    hook.addShape(hookShape);
    // make spring constraint
    const rope = new p2.LinearSpring(body, hook);
    // -----------------------------------------

    // define a user to keep track of stuff
    const user = {
      id: socket.id,
      name: name,
      color: util.randomColor(),
      body: body,
      input: {angle: 0, mouseDown: false, pastMouseDown: false},
      hook: hook,
      rope: rope,
    };

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

  userInput(currentUser, angle, mouseDown) {
    currentUser.input.angle = angle?angle:0;
    currentUser.input.mouseDown = mouseDown;
  }

  update(deltaTime) {
    for(let user of this.users) {
        user.body.applyForce([
          Math.cos(user.input.angle) * config.game.player.moveForce,
          Math.sin(user.input.angle) * config.game.player.moveForce
        ]);
      // grappling
      const mouseDown = user.input.mouseDown;
      console.log(mouseDown, user.input.pastMouseDown);
      if (mouseDown && !user.input.pastMouseDown) {
        // if the body isn't in the world create it
        this.world.addBody(user.hook);
        this.world.addSpring(user.rope);
      } else if (!mouseDown && user.input.pastMouseDown) {
        this.world.removeBody(user.hook);
        this.world.removeSpring(user.rope);
          console.log('removing spring', this.world.springs.length);
      }
      user.input.pastMouseDown = mouseDown;
    }
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
