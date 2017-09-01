import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import io from 'socket.io-client';

//import config from '../../../config.json';
import Game from './game-client';

export default class PixiJS extends Component {
  componentWillReceiveProps(nextProps) {
    if (!nextProps.menu && this.props.menu) {
      // Create a new game
      if (!this.socket && !this.game) {
        console.log('joining game...');
        // We store socket here so that we can pass it to a chat if we ever have one
        this.socket = io('ws://localhost:3002/');
        this.game = new Game(this.pixi, this.socket, nextProps.name);
      }
    }
  }

  componentDidMount() {
    this.pixi = new PIXI.Application(1280, 700, {
      view: this.canvas,
      backgroundColor : 0x1099bb,
    });
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    console.log('resizing screen')
    this.pixi.view.style.width = `${window.innerWidth}px`;
    this.pixi.view.style.height = `${window.innerHeight}px`;
  }

  componentWillUnmount() {
    this.game.destroy();
  }

  render() {
    return <canvas ref={canvas => this.canvas = canvas} />;
  }
}
