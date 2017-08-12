#!/usr/bin/env node
'use strict';

// from __future__ import process_dies_on_unhandled_rejection
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection:', reason);
  process.exit(1);
});

const app = require('./server/app');
const autoserve = require('autoserve');

// Make work with dev proxy thing in dev mode.
app.set('port', 3001);

autoserve(app);
