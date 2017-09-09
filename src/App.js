import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import GamePage from './pages/GamePage';
import AdminPage from './pages/AdminPage';

export default class App extends Component {
  constructor(props) {
    super(props);
  }



  pageSwitcher() {
    return (
      <Switch>
        <Route path={'/'} render={routeProps =>
          <GamePage
            history={routeProps.history}
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
