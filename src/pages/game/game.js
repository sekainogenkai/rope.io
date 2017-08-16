import io from 'socket.io-client';

export default class Game {
  constructor(pixi, name) {
    this.pixi = pixi;
    this.name = name
    this.socket = io('ws://localhost:3002/');
    this.setupSocket();
    this.pingCheck();
  }

  pingCheck() {
    this.startPingTime = Date.now();
    this.socket.emit('pingcheck');
  }

  setupSocket() {
    this.socket.on('pongcheck', () => {
      const latency = Date.now() - this.startPingTime;
      console.log('ping: ' + latency + 'ms');
    });
  }

  destroy() {
    this.pixi.destroy();
  }
}
