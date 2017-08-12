import React, { Component } from 'react';

import axios from 'axios';
import l from './l';
import './App.css';

const styles = {
  App: {
    backgroundColor: '#545523',
    height: '100vh',
  },
  AppHeader: {
    textAlign: 'center',
    backgroundColor: '#934023',
  },
  Message: {
    width: '300px',
    margin: '0 auto',
  },
  GameStart: {
    width: '300px',
    margin: '0 auto',
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      message: '',
    };
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

  handleSubmit(e) {
    e.preventDefault();
    axios.put(l`/api/displayName`, {displayName: this.state.displayName}).then(res => {
    }).catch(err => {
      console.error(err);
      alert('Connection to server failed');
    })
  }

  handleDisplayNameChange(e) {
    e.preventDefault();
    this.setState({displayName: e.target.value});
  }

  render() {
    const state = this.state;
    return (
      <div style={styles.App}>
        <div style={styles.AppHeader}>
          <h2>rope.io</h2>
        </div>
        <div style={styles.Message}>
            <h2>Message From the Creators</h2>
            <p>{state.message}</p>
          </div>
          <div style={styles.GameStart}>
            <span>Welcome to rope.io. Please enter your display name.</span>
            <form>
              <input onChange={this.handleDisplayNameChange}/>
              <button type='submit'>Play</button>
            </form>
          </div>
      </div>
    );
  }
}

export default App;
