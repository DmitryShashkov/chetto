(function (app) {
    var messagesElement = document.getElementById('messages');
    var visitorsElement = document.getElementById('visitors');

    function renderMessage (message) {
        var msg = JSON.parse(message);

        var messageHTML = [
            '<li class="row">',
            '<small class="time">', app.format.time(msg.t), ' </small>',
            '<span class="name">', msg.n, '</span>',
            '<p class="msg">', msg.m, '</p>',
            '</li>'
        ].join('');

        messagesElement.insertAdjacentHTML('beforeend', messageHTML);
        app.helpers.scrollToBottom();
    }

    function renderSystemMessage (message) {
        var messageHTML = [
            '<li class="row">',
            '<span class="chetto">Chetto: </span>',
            '<span class="system">', message, '</span>',
            '</li>'
        ].join('');

        messagesElement.insertAdjacentHTML('beforeend', messageHTML);
        app.helpers.scrollToBottom();
    }

    function renderVisitors (names) {
        while (visitorsElement.firstChild) {
            visitorsElement.removeChild(visitorsElement.firstChild);
        }

        names.forEach(function (name) {
            var visitorHTML = [
                '<li class="row">',
                name,
                '</li>'
            ].join('');

            visitorsElement.insertAdjacentHTML('beforeend', visitorHTML);
        });
    }

    app.render = {
        message: renderMessage,
        system: renderSystemMessage,
        visitors: renderVisitors
    };
})(App);