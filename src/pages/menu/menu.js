import React, { Component } from 'react';

const styles = {
  Menu: {
    position: "absolute",
    top: '25%',
    left: '25%',
    bottom: '25%',
    right: '25%',
    height: '50%',
    width: '50%',
    backgroundColor: '#545523',
  },
  MenuHeader: {
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

export default class Menu extends Component {
  handleGameStart = (e) => {
    e.preventDefault();
    this.props.onGameStart();
  }

  render() {
    const props = this.props;
    return (
      <div style={styles.Menu}>
        <div style={styles.MenuHeader}>
          <h2>rope.io</h2>
        </div>
        <div style={styles.Message}>
            <h2>Message From the Creators</h2>
            <p>{props.message}</p>
          </div>
          <div style={styles.GameStart}>
            <span>Welcome to rope.io. Please enter your display name.</span>
            <form onSubmit={this.handleGameStart}>
              <input
                type='text'
                value={props.displayName}
                onChange={props.onNameChange}
              />
              <button type='submit'>Play</button>
            </form>
            <button>Settings</button>
          </div>
      </div>
    );
  }
}
