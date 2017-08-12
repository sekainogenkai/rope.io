'user strict';

const express = require('express');
const bodyParser = require('body-parser');

const api = express();

const http = require('http').Server(api);
const io = require('socket.io')(http);

api.use(bodyParser.json());


module.exports = api;
