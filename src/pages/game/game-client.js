import * as PIXI from 'pixi.js';

export default class GameClient {
  constructor(pixi, socket, name) {
    pixi.ticker.add(this.update, this);
    this.pixi = pixi;
    this.socket = socket;
    this.players = {};
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
    const graphics = new PIXI.Graphics();
    graphics.beginFill(player.color, 1);
    graphics.drawCircle(player.state.position[0], player.state.position[1], 10);
    graphics.endFill();
    const text = new PIXI.Text(player.name);
    //graphics.addChild(text);
    this.pixi.stage.addChild(graphics);
    return {
      name: player.name,
      color: player.color,
      graphics: graphics,
      state: player.state,
      oldState: player.state,
    }
  }

  update(deltaTime) {
    for (let key in this.players) {
      let player = this.players[key];
      player.graphics.position.set(player.state.position[0], player.state.position[1]);
    }
  }

  destroy() {
    this.pixi.destroy();
  }
}
