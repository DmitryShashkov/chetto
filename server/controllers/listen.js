const CONST = require('./../constants');

const RedisConnection = require('redis-connection');
const SocketIO = require('socket.io');
const winston = require('winston');

let publisher = new RedisConnection();
let subscriber = new RedisConnection('subscriber');
let sockets;

let welcomeMessage = 'Welcome to simple Redis Chat!';

function handleConnection (socket) {
    socket.emit(CONST.IO.CHAT.WELCOME, welcomeMessage);

    socket.on(CONST.IO.CHAT.NAME_SET, (name) => {
        publisher.hset(CONST.REDIS.PEOPLE, socket.client.conn.id, name);
        publisher.publish(CONST.REDIS.CHAT.NEW_VISITOR, name);
    });

    socket.on(CONST.IO.CHAT.MESSAGE, (msg) => {
        publisher.hget (
            CONST.REDIS.PEOPLE,
            socket.client.conn.id,
            (err, name) => {
                if (err) {
                    return winston.log(CONST.WINSTON.LEVELS.ERROR, err);
                }

                let serializedMessage = JSON.stringify({
                    m: msg.replace(/</g, '&lt').replace(/>/g, '&gt'),
                    t: new Date().getTime(),
                    n: name
                });

                publisher.rpush(CONST.REDIS.CHAT.MESSAGES, serializedMessage);
                publisher.publish(CONST.REDIS.CHAT.NEW_MESSAGE, serializedMessage);
            });
    });

    socket.on(CONST.IO.ERROR, (err) => {
        return winston.log(CONST.WINSTON.LEVELS.ERROR, err);
    });

    // @todo: handle closing connection and remove entry from 'people' hash in redis
}

function init (server) {
    let initializers = [
        new Promise ((resolve, reject) => {
            publisher.on(CONST.REDIS.READY, () => {
                winston.log(CONST.WINSTON.LEVELS.INFO, 'Redis publisher initialized');
                return resolve();
            });
        }),
        new Promise ((resolve, reject) => {
            subscriber.on(CONST.REDIS.READY, () => {
                winston.log(CONST.WINSTON.LEVELS.INFO, 'Redis subscriber initialized');
                return resolve();
            });
        })
    ];

    Promise.all(initializers).then(() => {
        subscriber.subscribe (
            CONST.REDIS.CHAT.NEW_MESSAGE,
            CONST.REDIS.CHAT.NEW_VISITOR
        );

        sockets = SocketIO.listen(server);
        sockets.on(CONST.IO.CONNECTION, handleConnection);

        // channel, message
        subscriber.on(CONST.REDIS.MESSAGE, (channel, message) => {
            sockets.emit(channel, message);
        });

        winston.log(CONST.WINSTON.LEVELS.INFO, 'Sockets initialized');
    });
}

module.exports = {
    publisher: publisher,
    subscriber: subscriber,
    init: init
};
