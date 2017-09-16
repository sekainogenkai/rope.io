import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import GamePage from './pages/GamePage';

export default class App extends Component {
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
