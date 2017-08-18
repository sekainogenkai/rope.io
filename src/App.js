import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import GamePage from './pages/GamePage';
import AdminPage from './pages/AdminPage';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    }
  }

  componentDidMount() {
    this.loadMessage();
  }

  loadMessage() {
    axios.get('/api/message').then(res => {
      this.setState({message: res.message});
    }).catch(err => {
      console.error(err);
      this.setState({message: 'Failed to load message'});
    });
  }

  handleMessageChange = (e) => {
    e.preventDefault();
    this.setState({ message: e.target.value});
  }

  handleMessageSubmit = (e) => {
    e.preventDefault();
    axios.put('/api/message', this.state.message).then(res => {
      this.loadMessage();
    }).catch(err => {
      console.error(err);
      this.setState({message: 'Failed to load message'});
    });
  }

  pageSwitcher() {
    return (
      <Switch>
        <Route path={'/admin'} render={routeProps =>
          <AdminPage
            history={routeProps.history}
            message={this.state.message}
            onMessageChange={this.handleMessageChange}
            onMessageSubmit={this.handleMessageSubmit}
          />
        }/>
        <Route path={'/'} render={routeProps =>
          <GamePage
            history={routeProps.history}
            message={this.state.message}
          />
        }/>
      </Switch>
    )
  }

  render() {
    return (
      <div>
        {this.pageSwitcher()}
      </div>
    );
  }
}
