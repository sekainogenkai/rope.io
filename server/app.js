'use strict';

const express = require('express');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const app = express();

app.use((req, res, next) => {
  req.appBaseUrl = req.baseUrl;
  next();
});

// “/__” is a hack to get around the service worker for just these
// URIs which the browser has to actually navigate to for
// authentications to work. It is fragilely enabled by the following
// commit:
// https://github.com/sbuzonas/react-scripts/commit/5825a85b1fe65db56ceee420d4aebbb2804fa0c7
//
// Currently only used for Google login because PassportJS does not
// support implicit flow.
app.use(['/api', '/__api'], require('./api'), (req, res) => {
  res.status(404);
  res.send('<html><head><title>Not found</title></head><body><h1>Not found.</h1><p><a href="/">Return</a>.</p></body></html>');
});

app.get('/logout', (req, res) => {
  res.redirect('api/logout');
});

const staticPath = path.join(path.dirname(__dirname), 'build');
app.use(express.static(staticPath));
const indexPath = path.join(staticPath, 'index.html');

app.get('*', (req, res) => {
    // Um, unfortunately we don’t know how to validate routes within
    // the application. We should fix this to provide a proper 404
    // someday especially if we ever get server-side rendering which
    // really should replace what we have here.
    res.sendFile(indexPath);
});

module.exports = app;
