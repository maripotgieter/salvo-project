var main = new Vue({
    el: '#main',
    data: {
        games: [],
    },
    created: function () {
        this.start();
    },
    methods: {
        start: function () {
            var fetchConfig =
                fetch("/api/games", {
                    method: "GET",
                    credentials: "include",
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }

                }).then(function (json) {

                    var data = json;
                    console.log("data", data);
                    main.games = data;
                    //                    main.gamePlayers();
                    main.gameInformation();
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        gameInformation: function () {
            var empty = [];
            for (var i = 0; i < main.games.length; i++) {
                var date = new Date(main.games[i].created).toString();
                var playerOne = main.games[i].gamePlayers[0].player.email;
                 if (main.games[i].gamePlayers[1] != null ) {
                    var playerTwo = main.games[i].gamePlayers[1].player.email;
                } else {
                   var playerTwo = "JOIN" 
                }
                var object = {
                    emailOne : playerOne,
                    emailTwo : playerTwo,
                    date : date,
                }
                console.log(object) 
                empty.push(object);             
            }
            main.games = empty;
            console.log(main.games);
        },
    },
});
