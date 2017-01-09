const CONST = require('./../constants');

const RedisConnection = require('redis-connection');
const SocketIO = require('socket.io');
const winston = require('winston');

let publisher = new RedisConnection();
let subscriber = new RedisConnection('subscriber');
let sockets;

function handleConnection (socket) {

    socket.on(CONST.IO.CHAT.INIT, (data) => {
        publisher.hget (
            CONST.REDIS.PEOPLE,
            data.sender.id,
            (err, senderData) => {
                if (err || !senderData) {
                    return winston.log(CONST.WINSTON.LEVELS.ERROR, err);
                }

                let sender = JSON.parse(senderData);

                sender.connectionID = socket.client.conn.id;

                publisher.hset(CONST.REDIS.PEOPLE, data.sender.id, JSON.stringify(sender));
                publisher.publish(CONST.REDIS.CHAT.NEW_VISITOR, data.name);
            });
    });

    socket.on(CONST.IO.CHAT.MESSAGE, (msg) => {
        publisher.hget (
            CONST.REDIS.PEOPLE,
            msg.sender.id,
            (err, senderData) => {
                if (err) {
                    return winston.log(CONST.WINSTON.LEVELS.ERROR, err);
                }

                let sender = JSON.parse(senderData);

                if (sender.accessToken !== msg.sender.token) {
                    return winston.log(CONST.WINSTON.LEVELS.WARN, 'unauthorized');
                }

                let serializedMessage = JSON.stringify({
                    m: msg.text.replace(/</g, '&lt').replace(/>/g, '&gt'),
                    t: new Date().getTime(),
                    n: sender.displayName
                });

                publisher.rpush(CONST.REDIS.CHAT.MESSAGES, serializedMessage);
                publisher.publish(CONST.REDIS.CHAT.NEW_MESSAGE, serializedMessage);
            });
    });

    socket.on(CONST.IO.ERROR, (err) => {
        return winston.log(CONST.WINSTON.LEVELS.ERROR, err);
    });

    socket.on(CONST.IO.DISCONNECT, function() {
        let clientConnectionID = socket.client.conn.id;

        publisher.hgetall(
            CONST.REDIS.PEOPLE,
            (err, peopleData) => {
                if (err || !peopleData) {
                    return winston.log(CONST.WINSTON.LEVELS.ERROR, err);
                }

                let clientID;
                Object.keys(peopleData).forEach((key) => {
                    let parsedInfo = JSON.parse(peopleData[key]);
                    if (parsedInfo.connectionID === clientConnectionID) {
                        clientID = key;
                    }
                });

                if (clientID) {
                    publisher.hdel(CONST.REDIS.PEOPLE, clientID, () => {});
                    publisher.publish(CONST.REDIS.CHAT.VISITOR_DISCONNECTED, clientID);
                }
            }
        );
    });
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
            CONST.REDIS.CHAT.NEW_VISITOR,
            CONST.REDIS.CHAT.VISITOR_DISCONNECTED
        );

        sockets = SocketIO.listen(server);
        sockets.on(CONST.IO.CONNECTION, handleConnection);

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
