'use strict';

const express = require('express');
const path = require('path');
const app = express();
const api = require('./api');

app.use((req, res, next) => {
  req.appBaseUrl = req.baseUrl;
  next();
});

app.use('/api', api);

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

app.onConnection = function() {
  api.onConnection.apply(api, arguments);
}

module.exports = app;
