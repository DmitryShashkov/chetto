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

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, config.staticDir)));
app.use(router);

let server;
if (config.server.useHTTPS) {
    let credentials = {
        key: fs.readFileSync(config.certificates.key),
        cert: fs.readFileSync(config.certificates.crt),
        ca: config.certificates.ca.map(file => fs.readFileSync(file))
    };

    winston.log(CONST.WINSTON.LEVELS.INFO, 'Using HTTPS');
    server = https.createServer(credentials, app);
} else {
    winston.log(CONST.WINSTON.LEVELS.INFO, 'Using HTTP');
    server = http.createServer(app);
}

let port = config.server.port;
server.listen(port);
winston.log(CONST.WINSTON.LEVELS.INFO, 'Listening on port ' + port);

listen.init(server);