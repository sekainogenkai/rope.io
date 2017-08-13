import React, {Component} from 'react';
import io from 'socket.io-client';
import * as PIXI from 'pixi.js'; //https://github.com/pixijs/pixi.js/issues/3224

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.menu && this.props.menu) {
      console.log('we are going to try to connect');
      if (!this.socket) {
        this.socket = io('ws://localhost:3002/');
        this.handleConnect(this.socket);
      }
    }
  }

  componentDidMount() {
    this.app = new PIXI.Application(window.innerWidth, window.innerHeight, {
      view: this.canvas,
      backgroundColor : 0x1099bb,
    });
    this.handleWindowResize = () => {
     this.app.view.style.width = `${window.innerWidth}px`;
     this.app.view.style.height = `${window.innerHeight}px`;
    };
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  handleConnect(socket) {
    socket.on('pongcheck', () => {
      const latency = Date.now();
      console.log('Latency: ' + latency + 'ms');
    });
  }

  render() {
    return <canvas ref={canvas => this.canvas = canvas} />;
  }
}
