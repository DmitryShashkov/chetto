const config = require('./config/config');
const CONST = require('./server/constants');

const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const router = require('./server/router');
const http = require('http');
const https = require('https');
const winston = require('winston');
const fs = require('fs');

const express = require('express');
const app = express();
const listen = require('./server/controllers/listen');
const auth = require('./server/controllers/auth');

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, config.staticDir)));
app.use(auth.initialize());
app.use(router);

winston.log(CONST.WINSTON.LEVELS.INFO, 'Using HTTP');
let server = http.createServer(app);
let port = config.server.port;

server.listen(port);
winston.log(CONST.WINSTON.LEVELS.INFO, 'Listening on port ' + port);

listen.init(server);