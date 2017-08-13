import React, { Component } from 'react';
import axios from 'axios';
import l from '../l';

import Game from './game/game';
import Menu from './menu/menu';

const styles = {
  MainPage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  }
}

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      displayName: '',
      menu: true,
    };
  }

  componentDidMount() {
    this.loadMessage();
  }

  loadMessage() {
    axios.get(l`/api/message`).then(res => {
      this.setState({message: res.message});
    }).catch(err => {
      console.error(err);
      this.setState({message: 'Failed to load message'});
    });
  }

  handleGameStart = () => {
    if (this.state.displayName) {
      this.setState({ menu: false });
    }
  }

  handleNameChange = (e) => {
    e.preventDefault();
    this.setState({displayName: e.target.value});
  }

  render() {
    const state = this.state;
    return (
      <div style={styles.MainPage}>
        <Game
          displayName={state.displayName}
          menu={state.menu}
        />
        {state.menu ?
          <Menu
            displayName={state.displayName}
            onNameChange={this.handleNameChange}
            onGameStart={this.handleGameStart}
          />
        : []}
      </div>
    );
  }
}
