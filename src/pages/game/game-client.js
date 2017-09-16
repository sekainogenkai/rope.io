import * as PIXI from 'pixi.js';
import config from '../../config.json';

export default class GameClient {
  constructor(canvas, pixi, socket, name) {
    this.pixi = pixi;
    this.renderer = pixi.renderer;
    this.stage = pixi.stage;
    this.socket = socket;
    this.players = {};
    this.packetBuffer = new Array(3).fill({});
    // setup clicking stuff
    this.mouseDown = false;
    canvas.addEventListener('mousedown', () => this.mouseDown = true);
    canvas.addEventListener('mouseup', () => this.mouseDown = false);
    // setup socket
    this.setupSocket();
    // join the game
    socket.emit('join', name);

    // debug stuff
    const debug = new PIXI.Graphics();
    debug.lineStyle(20, 0xFFFFFF);
    debug.beginFill(0x000000, 0);
    debug.drawRect(0, 0, config.game.mapSize[0], config.game.mapSize[1]);
    debug.endFill();
    this.stage.addChild(debug);

    // drawing players
    this.graphics = new PIXI.Graphics();
    this.stage.addChild(this.graphics);
  }

  setupSocket() {
    const socket = this.socket;
    socket.on('start', (players) => {
      for (let player of players) {
        this.players[player.id] = this.createPlayer(player);
      }
      console.log(this.players);
      // start the update loop
      this.pixi.ticker.add(this.update, this);
    });

    socket.on('addPlayer', (player) => {
      this.players[player.id] = this.createPlayer(player);
      console.log(`${player.name} joined the game!`)
    });

    socket.on('removePlayer', (id) => {
      console.log(id);
      console.log(`${this.players[id].name} left the game!`)
      delete this.players[id];
    });

    socket.on('update', (players) => {
      this.packetBuffer.unshift({
        players: players,
      });
      this.packetBuffer.pop();
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

    let text = new PIXI.Text(player.name, {
      fontFamily : 'Arial',
      fontSize: 24,
      fill : 0xffffff,
      align : 'center',
      stroke: 0x000000,
      strokeThickness: 1,
    });
    text.anchor.set(0.5, 2);
    this.pixi.stage.addChild(text);
    // this will most likely change soon
    return {
      name: player.name,
      color: player.color,
      text: text,
      //graphics: graphics,
      state: player.state,
      oldState: player.state,
    }
  }

  moveCamera() {
    this.stage.pivot.x = this.players[this.socket.id].state.position[0];
    this.stage.pivot.y = this.players[this.socket.id].state.position[1];
    this.stage.position.x = this.renderer.width/2;
    this.stage.position.y = this.renderer.height/2;
  }

  update(deltaTime) {
    this.moveCamera();
    this.graphics.clear();
    for (let key in this.players) {
      let player = this.players[key];
      // draw hook if it exists
      if (player.state.hookPosition) {
        this.graphics.lineStyle(5, 0x000000);
        this.graphics.moveTo(player.state.position[0], player.state.position[1]);
        this.graphics.lineTo(player.state.hookPosition[0], player.state.hookPosition[1]);
        this.graphics.lineStyle(1, 0x000000);
        this.graphics.beginFill(player.color, 1);
        this.graphics.drawCircle(player.state.hookPosition[0], player.state.hookPosition[1], config.game.player.grapple.size);
        this.graphics.endFill();
      }
      // draw the player
      this.graphics.lineStyle(1, 0x000000);
      this.graphics.beginFill(player.color, 1);
      this.graphics.drawCircle(player.state.position[0], player.state.position[1], config.game.player.size);
      this.graphics.endFill();
      // reposition name text
      player.text.position.set(player.state.position[0], player.state.position[1]) ;
    }
    this.emitMouse();
  }

  emitMouse() {
    const mousePos = this.renderer.plugins.interaction.mouse.global;
    this.socket.emit('0', Math.atan2(mousePos.y - this.renderer.height/2, mousePos.x - this.renderer.width/2), this.mouseDown);
  }

  destroy() {
    this.pixi.destroy();
  }
}
