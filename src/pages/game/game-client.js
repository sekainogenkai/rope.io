import * as PIXI from 'pixi.js';
import p2 from 'p2';
import op from 'objectpool';

export default class GameClient {
  constructor(pixi, socket, name) {
    pixi.ticker.add(this.update, this);
    this.pixi = pixi;
    this.socket = socket;
    this.players = {};
    // grapics thing for drawing
    this.graphics = new PIXI.Graphics();
    this.pixi.stage.addChild(this.graphics);
    // Socket
    this.setupSocket();
    // join the game
    socket.emit('join', name);
  }

  setupSocket() {
    const socket = this.socket;
    socket.on('start', (players) => {
      for (let player of players) {
        this.players[player.id] = this.createPlayer(player);
      }
      console.log(this.players);
    });

    socket.on('addPlayer', (player) => {
      this.players[player.id] = this.createPlayer(player);
      console.log(`${player.name} joined the game!`)
    });

    socket.on('update', (players) => {
      for (let player of players) {
        let u = this.players[player.id];
        u.oldState = u.state;
        u.state = player.state;
      }
    });

    socket.on('disconnect', () => {
      socket.close();
    });
  }

  pingCheck() {
    const startPingTime = Date.now();
    this.socket.emit('pingcheck');
    this.socket.on('pongcheck', () => {
      const latency = Date.now() - startPingTime;
      console.log('ping: ' + latency + 'ms');
    });
  }

  createPlayer(player) {
    return {
      name: player.name,
      color: player.color,
      state: player.state,
      oldState: player.state,
    }
  }

  update(deltaTime) {
    this.graphics.clear();
    for (let key in this.players) {
      let player = this.players[key];
      this.graphics.beginFill(player.color, 1);
      this.graphics.drawCircle(player.state.position[0], player.state.position[1], 5);
      this.graphics.endFill();
    }
  }

  destroy() {
    this.pixi.destroy();
  }
}
