import React, { Component } from 'react';
import axios from 'axios';

const styles = {
  AdminPage: {
    backgroundColor: '#545523',
    height: '100vh',
  },
  Header: {
    textAlign: 'center',
    backgroundColor: '#934023',
  },
  Message: {
    width: '300px',
    margin: '0 auto',
  },
}

export default class AdminPage extends Component {
  render() {
    const props = this.props;
    return (
      <div style={styles.AdminPage}>
        <div style={styles.Header}>
          <h2>rope.io</h2>
        </div>
        <div style={styles.Message}>
          <h1>Admin Page</h1>
          <h2>Edit Message</h2>
          <form onSubmit={props.onMessageSubmit}>
            <input
              value={props.message}
              onChange={props.onMessageChange}/>
            <button type='submit'>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}
