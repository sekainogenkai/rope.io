export default class GameClient {
  constructor(pixi, socket, name) {
    this.pixi = pixi;
    this.socket = socket;
    this.users = [];
    this.setupSocket();
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
    });

    socket.on('disconnect', () => {
      socket.close();
    });
  }

  destroy() {
    this.pixi.destroy();
  }
}
