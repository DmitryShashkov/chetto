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

    function getName () {
        var chance = app.helpers.chance;

        var nameOptions = {};
        var chosenOption = chance.pickone([
            'middle', 'middle_initial', 'prefix', 'suffix'
        ]);

        nameOptions[chosenOption] = true;

        return chance.weighted([
            chance.name(),
            chance.name(nameOptions)
        ], [80, 20]);
    }

    app.format =  {
        time: getTime,
        name: getName
    };
})(App);
