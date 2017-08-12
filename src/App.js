import React, { Component } from 'react';
import { Switch, Route, Link} from 'react-router-dom';

import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';

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

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  pageSwitcher() {
    const ExtractAdminPage = ({match, history, location}) => {
      return <AdminPage
        history={history}
        />;
    };
    const ExtractMainPage = ({match, history, location}) => {
      return <MainPage
        history={history}
      />;
    };
    return (
      <Switch>
        <Route path={'/admin'} render={ExtractAdminPage}/>
        <Route path={'/'} render={ExtractMainPage}/>
      </Switch>
    )
  }

  render() {
    const state = this.state;
    return (
      <div style={styles.App}>
        {this.pageSwitcher()}
      </div>
    );
  }
}
