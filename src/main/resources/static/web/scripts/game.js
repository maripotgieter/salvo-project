//$.post("/api/login", { userName: "c.obrian@ctu.gov", password: "222" }).done(function() { console.log("logged in!"); })
$.post("/api/login", { userName: "c.obrian@ctu.gov", password: "42" }).done(function() { console.log("logged in!"); })
//$.post("/api/logout").done(function() { console.log("logged out"); })

var main = new Vue({
    el: '#main',
    data: {
        columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        game: [],
        id: '',
        players: [],
        playerTwoSalvo: [],
        playerTwoTurns: [],
        shipUserLocations: [],
        shipEnemyLocations: [],
        imageArray: ["1009975.png", "pirate.png", "Pirate_face.png", "pirate_face_2.png", "pirate_face_3.png", "pirate_face_5.png", "1009995.png", "parrot different.png"],
        image: '',
        userName:"j.bauer@ctu.gov",
        password:"24",
    },
    created: function () {
        this.findTheID();
        this.start(this.id);
    },
    methods: {
        start: function (id) {
            var fetchConfig =
                fetch("/api/game_view/" + id, {
                    method: "GET",
                    credentials: "include",
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(function (json) {
                    var data = json;
                    console.log("data", data);
                    main.game = data;
                    main.login();
                    main.locationInformation();
                    main.gameInformation();
                    main.salvoLocationInformationEnemy(main.game.enemy_salvoes, main.shipUserLocations, "U");
                    main.salvoLocationInformationEnemy(main.game.user_salvoes, main.shipEnemyLocations, "E");
                    main.shuffleImageArray('pirate_image');
                    main.shuffleImageArray('other_pirate_image');
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        login: function() {
            var fetchConfig =
          fetch("/api/login", {
                   credentials: 'include',
                   method: 'POST',
                   headers: {
                       'Accept': 'application/json',
                       'Content-Type': 'application/x-www-form-urlencoded'
                   },
                   body: 'userName=' + this.userName + '&password=' + this.password,
               })  
        },
        locationInformation: function () {
            let ships = this.game.ships;
            for (var i = 0; i < ships.length; i++) {
                for (var j = 0; j < ships[i].location.length; j++) {
                    let shipLocation = this.game.ships[i].location[j];
                    this.shipUserLocations.push(shipLocation);
                    document.getElementById("U" + shipLocation).classList.add("ship-location");
                }
            }
        },
        findTheID: function () {
            this.id = location.search.split("=")[1];
        },
        gameInformation: function () {
            var empty = [];
            let gamePlayers = this.game.game.gamePlayers;
            for (var i = 0; i < gamePlayers.length; i++) {
                var player = gamePlayers[i].player.email;
                if (this.id == gamePlayers[i].id) {
                    player += " (You)";
                }
                empty.push(player);
                this.players = empty;
            }
        },
        salvoLocationInformationEnemy: function (salvoes, shipArray, tbl) {
            var matches = [];
            for (var i = 0; i < salvoes.length; i++) {
                let salvoArray = salvoes[i].locations;
                for (var j = 0; j < salvoArray.length; j++) {
                    let cell = document.getElementById(tbl + salvoArray[j]);
                    cell.innerHTML = salvoes[i].turn;
                    if (cell.classList.contains("ship-location")) {
                        cell.classList.remove('ship-location');
                        cell.classList.add('hits');
                    } else {
                        cell.classList.add("salvo-location");
                    }
                }
            }
        },
        shuffleImageArray: function (id) {
            var path = 'styles/images/';
            let imageArray = this.imageArray;
            var num = Math.floor(Math.random() * imageArray.length);
            var img = imageArray[num];
            var div = document.getElementById(id);
            div.innerHTML += '<img src="' + path + img + '" alt = "">';
            
        },
    },
})

