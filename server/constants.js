module.exports = {
    WINSTON: {
        LEVELS: {
            INFO: 'info',
            WARN: 'warn',
            ERROR: 'error'
        }
    },
    REDIS: {
        CHAT: {
            MESSAGES: 'chat:messages',
            NEW_MESSAGE: 'chat:messages:latest',
            NEW_VISITOR: 'chat:people:new',
            VISITOR_DISCONNECTED: 'chat:people:disconnected'
        },
        READY: 'ready',
        MESSAGE: 'message',
        PEOPLE: 'people'
    },
    IO: {
        CONNECTION: 'connection',
        ERROR: 'error',
        DISCONNECT: 'disconnect',
        CHAT: {
            INIT: 'io:init',
            MESSAGE: 'io:message'
        }
    }
};
