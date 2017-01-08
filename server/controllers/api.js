const CONST = require('./../constants');

let publisher;
let subscriber;

function init (pub, sub) {
    publisher = pub;
    subscriber = sub;
}

function loadMessages (req, res, next) {
    publisher.lrange (
        CONST.REDIS.CHAT.MESSAGES, 0, -1,
        (err, data) => {
            if (err) {
                return next(err);
            }

            return res.send(data);
        }
    );
}

function loadVisitors (req, res, next) {
    publisher.hgetall(CONST.REDIS.PEOPLE, (err, people) => {
        if (err) {
            return next(err);
        }

        return res.send(people);
    });
}

module.exports = {
    init: init,
    loadMessages: loadMessages,
    loadVisitors: loadVisitors
};