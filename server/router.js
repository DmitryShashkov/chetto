const config = require('./../config/config');
const CONST = require('./constants');

const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const app = express.Router();

const site = require('./controllers/site');

const listen = require('./controllers/listen');
const api = require('./controllers/api');

api.init(listen.publisher, listen.subscriber);

app.get('/', site.main);
app.get('/node-modules/*', site.nodeModules);

app.get('/api/messages', api.loadMessages);
app.get('/api/visitors', api.loadVisitors);

module.exports = app;