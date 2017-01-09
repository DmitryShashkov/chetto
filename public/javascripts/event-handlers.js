(function (app) {
    var messageInput = document.getElementById('message-input');

    function onFormSubmit (event) {
        event.preventDefault();

        var msg = messageInput.value;
        var user = app.cookies.get('user');

        var noMessage = !msg.length || msg.match(/^[\s]*$/) !== null;
        var noName = !app.format.user.name(user).length;

        if (noMessage) {
            return app.render.system('please enter your message');
        }
        if (noName) {
            return app.helpers.getName();
        }

        app.socket.emit('io:message', {
            text: msg,
            sender: {
                id: app.format.user.id(user),
                token: app.format.user.token(user)
            }
        });

        messageInput.value = '';
    }

    function onMessageReceived (msg) {
        app.render.message(msg);
    }

    function onNewVisitor (name) {
        app.render.system(name + ' joined the chat');
        app.load.visitors();
    }

    function onVisitorDisconnected () {
        app.load.visitors();
    }

    app.on = {
        formSubmit: onFormSubmit,
        messageReceived: onMessageReceived,
        newVisitor: onNewVisitor,
        visitorDisconnected: onVisitorDisconnected
    };
})(App);