import React, { Component } from 'react';
import axios from 'axios';
import l from '../l';

import PixiJS from './game/react-pixi';
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
    })
  }

  handleNameSubmit = (e) => {
    e.preventDefault();
    axios.put(l`/api/displayName`, {displayName: this.state.displayName}).then(res => {
      // Do something
    }).catch(err => {
      console.error(err);
      alert('Connection to server failed');
    })
  }

  handleNameChange = (e) => {
    e.preventDefault();
    this.setState({displayName: e.target.value});
  }

  render() {
    const state = this.state;
    return (
      <div style={styles.MainPage}>
        <PixiJS/>
        {this.state.menu ?
          <Menu
            displayName={this.state.displayName}
            onNameChange={this.handleNameChange}
            onNameSubmit={this.handleNameSubmit}
          />
        : []}
      </div>
    );
  }
}
