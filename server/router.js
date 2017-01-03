const config = require('./../config/config');
const CONST = require('./constants');

const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const app = express.Router();

const SiteController = require('./controllers/site');

const listen = require('./controllers/listen');
const api = require('./controllers/api');

api.init(listen.publisher, listen.subscriber);

app.get('/', SiteController.main);

app.get('/load', api.loadMessages);

module.exports = app;