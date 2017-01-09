const config = require('./../../config/config');

const fs = require('fs');
const path = require('path');

function main (req, res, next) {
    fs.createReadStream (
        path.join(config.staticDir, 'index.html')
    ).pipe(res);
}

function auth (req, res, next) {
    fs.createReadStream (
        path.join(config.staticDir, 'auth.html')
    ).pipe(res);
}

function nodeModules (req, res, next) {
    let modulePath = req.originalUrl.replace('/node-modules/', '');

    fs.createReadStream (
        path.join('node_modules', modulePath)
    ).pipe(res);
}

module.exports = {
    main: main,
    auth: auth,
    nodeModules: nodeModules
};