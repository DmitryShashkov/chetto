const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const app = express.Router();

const site = require('./controllers/site');

const listen = require('./controllers/listen');
const api = require('./controllers/api');
const auth = require('./controllers/auth');

api.init(listen.publisher, listen.subscriber);
auth.redis.init(listen.publisher, listen.subscriber);

app.get('/', site.main);
app.get('/auth', site.auth);
app.get('/node-modules/*', site.nodeModules);

app.get('/auth/google',
    auth.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login'
        ]
    })
);
app.get('/auth/google/callback',
    auth.authenticate('google', {
        failureRedirect: '/auth',
        session: false
    }), (req, res) => {
        res.cookie('user', req.user, {
            httpOnly: false
        });
        res.redirect('/');
    });

app.get('/api/messages', api.loadMessages);
app.get('/api/visitors', api.loadVisitors);

module.exports = app;