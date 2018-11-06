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
//$.post("/api/login", {
//    userName: "j.bauer@ctu.gov",
//    password: "24"
//}).done(function () {
//    console.log("logged in!");
//})
//$.post("/api/logout").done(function() { console.log("logged out"); })

var main = new Vue({
    el: '#main',
    data: {
        scores: [],
        userName: "",
        password: "",
        response: [],
        message: '',
        games: [],
        gameInfo: [],
        loggedIn: false,
        signup: [],
        currentUser: '',
        resp: [],
        createdResponse: [],
        gameId: [],
        path: 0,

        //        buttonName: '',
        //        href: href ="http://localhost:8080/web/games.html",
    },
    created: function () {
        this.getGamesObject();
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
        login: function () {
            var fetchConfig =
                fetch("/api/login", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'userName=' + this.userName + '&password=' + this.password,

                }).then(function (json) {
                    var data = json;
                    console.log(data);
                    main.response = data;
                    console.log(main.response.status);
                    //                    main.games.player.username;

                    if (main.response.status == 401) {
                        main.message = 'Login Unsuccessful! Please try again!';
                        main.loggedIn = false;
                    } else {

                        main.message = '';
                        main.loggedIn = true;
                        main.getGamesObject();
                        //                        main.gameInformation();
                        //                        main.currentUser = main.games.player.username;
                    }

                })
                .catch(function (error) {
                    console.log(error);
                })

        },
        getGamesObject: function () {
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
                    console.log(data);
                    main.games = data;
                    main.gameInformation();

                    if (main.games.player != null) {
                        main.loggedIn = true;
                        main.currentUser = main.games.player.username;
                    } else {
                        main.loggedIn = false;
                        main.currentUser = '';
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        logout: function () {
            var fetchConfig =
                fetch("/api/logout", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'userName=' + this.userName + '&password=' + this.password,

                }).then(function (json) {
                    var data = json;
                    console.log(data);
                    main.loggedIn = false;
                    main.message = '';
                    main.getGamesObject();
                    main.gameInformation();
                })
                .catch(function (error) {
                    console.log(error);
                })

        },
        signUp: function () {
            var fetchConfig =
                fetch("/api/players", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'userName=' + this.userName + '&password=' + this.password,

                }).then(function (json) {
                    var data = json;
                    console.log(data);
                    main.signup = data;
                    console.log(main.signup.status);

                    if (main.signup.status == 409) {
                        main.message = "User already exists! Please try again or login";
                        main.loggedIn = false;
                    } else if (main.signup.status == 403) {
                        main.message = "Please complete the required fields!";
                        main.loggedIn = false;
                    } else {
                        main.login();
                        main.getGamesObject();
                        main.message = '';
                        main.currentUser = main.games.player.username;
                        main.loggedIn = true;
                        main.start();
                    }


                })
                .catch(function (error) {
                    console.log(error);
                })

        },
        validateForm: function () {
            var x = document.forms["myForm"]["userName"].value;
            if (x == /(.+)@(.+){2,}\.(.+){2,}/.test(userName)) {
                alert("Name must be filled out");
                return false;
            } else {

            }
        },
        gameInformation: function () {
            var empty = [];
            for (var i = 0; i < main.games.games.length; i++) {
                var numberOfGame = main.games.games[i].id;
                var date = new Date(main.games.games[i].created).toLocaleString();
                var playerOne = main.games.games[i].gamePlayers[0].player.username;
                var gpIdOne = main.games.games[i].gamePlayers[0].id;
                if (main.games.games[i].gamePlayers[1] != null) {
                    var playerTwo = main.games.games[i].gamePlayers[1].player.username;
                    var gpIdTwo = main.games.games[i].gamePlayers[1].id;
                } else {
                    var playerTwo = "JOIN";
                    var gpIdTwo = "";
                }
                var object = {
                    number: numberOfGame,
                    emailOne: playerOne,
                    gpIdOne: gpIdOne,
                    emailTwo: playerTwo,
                    gpIdTwo: gpIdTwo,
                    date: date,
                }
                empty.push(object);
            }
            main.gameInfo = empty;

        },
        newGame: function () {
            var fetchConfig =
                fetch("/api/games", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },

                })
                .then(response => {
                    console.log(response)
                    var x = response;
                    main.createdResponse = x;
                    console.log(main.createdResponse);
                    this.createdResponse.json()
                        .then(json => {
                            var res = json;
                            main.resp = res;
                            console.log(main.resp.gpId);
                            if (this.createdResponse.status == 201) {
                                location.assign("game.html?gp=" + this.resp.gpId);
                            } else {
                                main.message = "Could not create game! Please try again!"
                            }

                        })
                })

                .catch(function (error) {
                    console.log(error);
                })
        },
        joinGame: function (gameId) {
            var fetchConfig =
                fetch("/api/games/" + gameId + "/players", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },

                })
                .then(response => {
                    var x = response;
                    main.createdResponse = x;
                    console.log(response)
                    this.createdResponse.json().then(json => {
                        var res = json;
                        main.resp = res;
                        console.log(main.resp.gpId);
                        if (this.createdResponse.status == 201) {
                            location.assign("game.html?gp=" + this.resp.gpId);
                        } else if (this.createdResponse.status == 401) {
                            main.message = "Could not join game! Please login!"
                        } else {
                            main.message = "Could not join game! Game full!"
                        }
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        returnToGame: function (id) {
            location.assign("/web/game.html?gp=" + id);
        },
        gamesPage: function () {
            this.path = 1;
        },
        leaderboardPage: function () {
            this.path = 0;
        },
    }

})
