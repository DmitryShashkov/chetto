var App = {
    form: document.getElementById('form'),
    socket: window.io(),
    init: function () {
        form.addEventListener('submit', App.on.formSubmit);
        window.addEventListener('resize', App.helpers.scrollToBottom);
        App.socket.on('chat:messages:latest', App.on.messageReceived);
        App.socket.on('chat:people:new', App.on.newVisitor);
        App.socket.on('chat:people:disconnected', App.on.visitorDisconnected);

        App.helpers.initName();
        App.load.messages();
    },
    unload: function () {
        App.cookies.set('user', null, 0);
    }
};

document.addEventListener('DOMContentLoaded', App.init);
window.addEventListener('beforeunload', App.unload);