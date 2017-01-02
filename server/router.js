const config = require('./../config/config');
const CONST = require('./constants');

const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const app = express.Router();

let SiteController = require('./controllers/site');
let APIController = require('./controllers/api');

app.get('/', SiteController.main);

module.exports = app;