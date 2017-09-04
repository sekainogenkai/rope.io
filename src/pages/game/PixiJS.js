import React, {Component} from 'react';
import * as PIXI from 'pixi.js';
import io from 'socket.io-client';
import config from '../../config.json';
import Game from './game-client';

const screenRatio = config.game.screenSize[0]/config.game.screenSize[1];

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
    this.pixi = new PIXI.Application(config.game.screenSize[0], config.game.screenSize[1], {
      view: this.canvas,
      backgroundColor : 0x1099bb,
    });
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    console.log('resizing screen');
    let w, h = 0;
    if (window.innerWidth / window.innerHeight <= screenRatio) {
        w = window.innerHeight * screenRatio;
        h = window.innerHeight;
    } else {
        w = window.innerWidth;
        h = window.innerWidth / screenRatio;
    }
    this.pixi.renderer.view.style.width = w + 'px';
    this.pixi.renderer.view.style.height = h + 'px';
  }

  componentWillUnmount() {
    this.game.destroy();
  }

  render() {
    return <canvas ref={canvas => this.canvas = canvas} />;
  }
}
