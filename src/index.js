import { createBrowserHistory, } from 'history';
import './index.css';
import qhistory from 'qhistory';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// Adds query string support to react router by adding a query
// property on the location prop. See
// https://www.npmjs.com/package/qhistory
const history = qhistory(createBrowserHistory(), query => {
  return Object.keys(query).reduce((s, key) => {
    const value = query[key];
    if (value === undefined) {
      return s;
    }
    const prefix = `${s}${s === '' ? '' : '&'}${encodeURIComponent(key)}`;
    // null is special. Just inclue key, no =. idk why.
    if (value === null) {
      return prefix;
    }
    return `${prefix}=${encodeURIComponent(value)}`;
  }, '');
}, s => {
  return s.split('&').reduce((query, chunk) => {
    const parts = chunk.split('=');
    query[decodeURIComponent(parts[0])] = parts.length === 1 ? null : decodeURIComponent(parts[1]);
    return query;
  }, Object.create(null));
});

ReactDOM.render(
    <Router history={history}>
      <App/>
    </Router>,
  document.getElementById('root')
);

// Make offline magical stuff for browsers. Should mitigate Aaron’s
// server being slow.
registerServiceWorker();
