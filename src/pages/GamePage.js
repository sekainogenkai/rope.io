import React, { Component } from 'react';
import axios from 'axios';

import PixiJS from './game/PixiJS';
import Menu from './menu/Menu';

const styles = {
  Game: {
    width: '100%',
    height: '100%',
    position: 'fixed',
    overflow: 'hidden',
  }
}

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: true,
      name: '',
    };
  }

  handleNameChange = (e) => {
    e.preventDefault();
    this.setState({ name: e.target.value });
  }

  handleGameStart = (e) => {
    e.preventDefault();
    if (this.state.name) {
      this.setState({ menu: false });
    }
  }

  render() {
    const state = this.state;
    return (
      <div style={styles.Game}>
        <PixiJS
          name={state.name}
          menu={state.menu}
        />
        {state.menu ?
          <Menu
            name={state.name}
            message={this.props.message}
            onNameChange={this.handleNameChange}
            onGameStart={this.handleGameStart}
          />
        : []}
      </div>
    );
  }
}
