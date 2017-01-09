(function (app) {
    function redirectToAuth() {
        window.location.href = '/auth';
    }

    function initName () {
        var user = app.cookies.get('user');
        var name = app.format.user.name(user);

        if (!name.length) {
            return redirectToAuth();
        }

        app.socket.emit('io:init', {
            name: name,
            sender: {
                id: app.format.user.id(user),
                token: app.format.user.token(user)
            }
        });

        return name;
    }

    function scrollToBottom () {
        window.scrollTo(0, document.body.scrollHeight);
    }

    app.helpers = {
        initName: initName,
        scrollToBottom: scrollToBottom,
        chance: window.chance
    };
})(App);