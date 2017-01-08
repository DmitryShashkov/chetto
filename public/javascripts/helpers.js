(function (app) {
    var cookiesLifeExpectancy = 7;

    function getName () {
        var name = app.cookies.get('name');

        if (!name || name === 'null') {
            name = app.format.name();
            app.cookies.set('name', name, cookiesLifeExpectancy);
        }
        app.socket.emit('io:name', name);

        return name;
    }

    function scrollToBottom () {
        window.scrollTo(0, document.body.scrollHeight);
    }

    app.helpers = {
        getName: getName,
        scrollToBottom: scrollToBottom,
        chance: window.chance
    };
})(App);