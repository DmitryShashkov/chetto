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

module.exports = {
    init: init,
    loadMessages: loadMessages
};