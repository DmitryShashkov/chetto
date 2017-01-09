const config = require('./../../config/config');
const CONST = require('./../constants');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

let publisher;
let subscriber;

passport.use(new GoogleStrategy({
    clientID: config.google.web.clientID,
    clientSecret: config.google.web.clientSecret,
    callbackURL: config.google.web.redirectURIs[0]
}, (accessToken, refreshToken, profile, done) => {
    let userData = {
        displayName: profile.displayName,
        connectionID: null,
        accessToken: accessToken
    };

    publisher.hset(CONST.REDIS.PEOPLE, profile.id, JSON.stringify(userData));

    return done(null, JSON.stringify({
        id: profile.id,
        userData: userData
    }));
}
));

passport.redis = {
    init: function (pub, sub) {
        publisher = pub;
        subscriber = sub;
    }
};

module.exports = passport;