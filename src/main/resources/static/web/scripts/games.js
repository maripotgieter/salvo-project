//var main = new Vue({
//    el: '#main',
//    data: {
//        games: [],
//    },
//    created: function () {
//        this.start();
//    },
//    methods: {
//        start: function () {
//            var fetchConfig =
//                fetch("/api/games", {
//                    method: "GET",
//                    credentials: "include",
//                }).then(function (response) {
//                    if (response.ok) {
//                        return response.json();
//                    }
//
//                }).then(function (json) {
//
//                    var data = json;
//                    console.log("data", data);
//                    main.games = data;
//                    //                    main.gamePlayers();
//                    main.gameInformation();
//                })
//                .catch(function (error) {
//                    console.log(error);
//                })
//        },
//        gameInformation: function () {
//            var empty = [];
//            for (var i = 0; i < main.games.length; i++) {
//                var date = new Date(main.games[i].created).toLocaleString();
//                var playerOne = main.games[i].gamePlayers[0].player.email;
//                 if (main.games[i].gamePlayers[1] != null ) {
//                    var playerTwo = main.games[i].gamePlayers[1].player.email;
//                } else {
//                   var playerTwo = "JOIN" 
//                }
//                var object = {
//                    emailOne : playerOne,
//                    emailTwo : playerTwo,
//                    date : date,
//                }
//                console.log(object) 
//                empty.push(object);             
//            }
//            main.games = empty;
//            console.log(main.games);
//        },
//    },
//});

//$.post("/api/login", { userName: "j.bauer@ctu.gov", password: "123" }).done(function() { console.log("logged in!"); })
$.post("/api/login", { userName: "j.bauer@ctu.gov", password: "24" }).done(function() { console.log("logged in!"); })
//$.post("/api/logout").done(function() { console.log("logged out"); })

var main = new Vue({
    el: '#main',
    data: {
        scores: [],
    },
    created: function () {
        this.start();
    },
    methods: {
        start: function () {
            var fetchConfig =
                fetch("/api/scoreboard", {
                    method: "GET",
                    credentials: "include",
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }

                }).then(function (json) {

                    var data = json;
                    console.log("data", data);
                    main.scores = data;
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        
    }
})