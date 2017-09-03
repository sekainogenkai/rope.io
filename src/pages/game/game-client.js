import * as PIXI from 'pixi.js';
import config from '../../config.json';

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

    ///debug stuff
    const debug = new PIXI.Graphics();
    debug.lineStyle(20, 0x00FFFF);
    debug.beginFill(0x000000, 0);
    debug.drawRect(0, 0, config.game.mapWidth, config.game.mapHeight);
    debug.endFill();
    debug.lineStyle(10, 0xFF0000);
    debug.beginFill(0x000000, 0);
    debug.drawRect(0, 0, config.game.screenWidth, config.game.screenHeight);
    debug.endFill();
    this.pixi.stage.addChild(debug);

    this.graphics = new PIXI.Graphics();
    this.pixi.stage.addChild(this.graphics);
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
    // const graphics = new PIXI.Graphics();
    // graphics.beginFill(player.color, 1);
    // graphics.drawCircle(player.state.position[0], player.state.position[1], 10);
    // graphics.endFill();
    //const text = new PIXI.Text(player.name);
    //graphics.addChild(text);
    //this.pixi.stage.addChild(graphics);
    return {
      name: player.name,
      color: player.color,
      //graphics: graphics,
      state: player.state,
      oldState: player.state,
    }
  }

  update(deltaTime) {
    this.graphics.clear();
    for (let key in this.players) {
      let player = this.players[key];
      this.graphics.beginFill(player.color, 1);
      this.graphics.drawCircle(player.state.position[0], player.state.position[1], config.game.player.size);
      this.graphics.endFill();
    }
    this.emitMouse();
  }

  emitMouse() {
    const mousePos = this.pixi.renderer.plugins.interaction.mouse.global;
    const playerPos = (this.players[this.socket.id]) ? this.players[this.socket.id].state.position : mousePos;
    this.socket.emit('0', Math.atan2(mousePos.y - playerPos[1], mousePos.x - playerPos[0]), false);
  }

  destroy() {
    this.pixi.destroy();
  }
}
