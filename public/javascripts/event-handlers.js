(function (app) {
    var messageInput = document.getElementById('message-input');

    function onFormSubmit (event) {
        event.preventDefault();

        var msg = messageInput.value;
        var noMessage = !msg.length || msg.match(/^[\s]*$/) !== null;
        var noName =
            !app.cookies.get('name') ||
            app.cookies.get('name').length < 1 ||
            app.cookies.get('name') === 'null';

        // if input is empty or white space do not send message
        if (noMessage) {
            return app.render.system('please enter your message');
        }

        if (noName) {
            return app.helpers.getName();
        }

        app.socket.emit('io:message', msg);
        messageInput.value = '';
    }

    function onMessageReceived (msg) {
        app.render.message(msg);
    }

    function onNewVisitor (name) {
        var greetingMessage = (name === app.cookies.get('name'))
            ? 'welcome to chat! we will call you ' + name
            : name + ' joined the chat';

        app.render.system(greetingMessage);
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