#!/usr/bin/env node
'use strict';

// from __future__ import process_dies_on_unhandled_rejection
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection:', reason);
  process.exit(1);
});

const app = require('./server/app');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Make work with dev proxy thing in dev mode.
io.on('connection', app.onConnection);
server.listen(3001, '0.0.0.0');
