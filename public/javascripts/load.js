(function (app) {
    function loadMessages () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/messages', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    data.forEach(function (msg) {
                        app.render.message(msg);
                    });
                }
            }
        };
        xhr.send();
    }

    function loadVisitors () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/visitors', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    var names = Object.keys(data).map(function (key) {
                        return data[key];
                    });

                    app.render.visitors(names);
                }
            }
        };
        xhr.send();
    }

    app.load = {
        messages: loadMessages,
        visitors: loadVisitors
    };
})(App);