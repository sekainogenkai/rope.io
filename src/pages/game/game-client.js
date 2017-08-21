import * as PIXI from 'pixi.js';

export default class GameClient {
  constructor(pixi, socket, name) {
    pixi.ticker.add(this.update, this);
    this.pixi = pixi;
    this.socket = socket;
    this.users = [];
    this.setupSocket();
    // join the game
    socket.emit('join', name);
  }

  setupSocket() {
    const socket = this.socket;

    /* ping check */
    const startPingTime = Date.now();
    this.socket.emit('pingcheck');
    socket.on('pongcheck', () => {
      const latency = Date.now() - startPingTime;
      console.log('ping: ' + latency + 'ms');
    });

    socket.on('update', (userData) => {
      this.users = userData;
      for (let user of this.users) {
        let circle = new PIXI.Graphics();
        circle.lineStyle(2, user.color);
        circle.drawCircle(user.position[0], user.position[1], user.radius);
        circle.endFill();
        this.pixi.stage.addChild(circle);
      }
    });

    socket.on('disconnect', () => {
      socket.close();
    });
  }

  update(deltaTime) {

  }

  destroy() {
    this.pixi.destroy();
  }
}
