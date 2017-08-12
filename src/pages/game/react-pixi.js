import React, {Component} from 'react';
import * as PIXI from 'pixi.js'; //https://github.com/pixijs/pixi.js/issues/3224

export default class PixiJS extends Component {
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

  componentWillUnmount() {
    // Maybe do some unmounting business
  }

  render() {
    return <canvas ref={canvas => this.canvas = canvas} />;
  }
}
