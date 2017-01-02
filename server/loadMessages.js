'use strict';

var redisClient = require('redis-connection')();
// var handleError = require('hapi-error').handleError;

function loadMessages (req, res) {
    redisClient.lrange('chat:messages', 0, -1, function (error, data) {
        // handleError(error, error);

        return res.send(data);
    });
}

module.exports = {
    load: loadMessages,
    redisClient: redisClient
};