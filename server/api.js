'user strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);


const api = express();

api.use(bodyParser.json());
