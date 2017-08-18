export default class GameClient {
  constructor(pixi, socket, name) {
    this.pixi = pixi;
    this.socket = socket;
    this.setupSocket();
    socket.emit('join', name);
  }

  setupSocket() {
    const socket = this.socket;
    // Do a ping check
    const startPingTime = Date.now();
    this.socket.emit('pingcheck');
    socket.on('pongcheck', () => {
      const latency = Date.now() - startPingTime;
      console.log('ping: ' + latency + 'ms');
    });

    socket.on('disconnect', function () {
      socket.close();
    });
  }

  destroy() {
    this.pixi.destroy();
  }
}
