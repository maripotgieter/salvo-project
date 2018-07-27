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
                    main.locationInformation();
                    main.gameInformation();
                    main.salvoLocationInformationEnemy(main.game.enemy_salvoes,main.shipUserLocations, "U");
                    main.salvoLocationInformationEnemy(main.game.user_salvoes,main.shipEnemyLocations,"E");
                })
                .catch(function (error) {
                    console.log(error);
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
                    player +=" (You)";
                }
                empty.push(player);
                this.players = empty;
            }
        },
        salvoLocationInformationEnemy: function (salvoes,shipArray, tbl) {
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
    },
})
