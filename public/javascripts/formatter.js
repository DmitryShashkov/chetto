(function (app) {
    function leadZero (number) {
        return (number < 10) ? '0' + number : number;
    }

    function getTime (timestamp) {
        var t, h, m, s;

        t = new Date(timestamp);
        h = leadZero(t.getHours());
        m = leadZero(t.getMinutes());
        s = leadZero(t.getSeconds());

        return String(h) + ':' + m + ':' + s;
    }

    function getUserName (user) {
        try {
            var parsedData = JSON.parse(user);
            return parsedData.displayName || parsedData.userData.displayName;
        } catch (exc) {
            return '';
        }
    }

    function getUserToken (user) {
        try {
            var parsedData = JSON.parse(user);
            return parsedData.accessToken || parsedData.userData.accessToken;
        } catch (exc) {
            return '';
        }
    }

    function getUserID (user) {
        try {
            return JSON.parse(user).id;
        } catch (exc) {
            return '';
        }
    }

    app.format =  {
        time: getTime,
        user: {
            name: getUserName,
            token: getUserToken,
            id: getUserID
        }
    };
})(App);
