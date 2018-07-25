var main = new Vue({
    el: '#main',
    data: {
        columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        game: [],
        id: '',
        players: [],
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
                    main.salvoLocationInformation();

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
                    console.log(shipLocation);
                    document.getElementById("U" + shipLocation).classList.add("ship-location");
                }
            }

        },
        findTheID: function () {
            var url = location.search;
            var x = url.split("=")[1];

            this.id = x;

        },
        gameInformation: function () {
            var empty = [];
            for (var i = 0; i < this.game.game.gamePlayers.length; i++) {

                if (this.id == this.game.game.gamePlayers[i].player.id) {
                    var player = this.game.game.gamePlayers[i].player.email + " (You)"
                } else {
                    var player = this.game.game.gamePlayers[i].player.email;
                }
                empty.push(player);
                this.players = empty;

            }
            console.log(this.players);
        },
        salvoLocationInformation: function () {
            let salvoes = this.game.salvoes;
            for (var i = 0; i < salvoes.length; i++) {
//                                console.log(salvoes[i].length);
                for (var j = 0; j < salvoes[i].length; j++) {
//                                        console.log(salvoes[i][j]);
                    let salvoArray = salvoes[i][j];
//                    console.log(salvoArray..length);
                    for (var k = 0; k < salvoArray.locations.length; k++) {
                        let salvoArr = salvoArray.locations[k];
                        console.log(salvoArr);
                        //                       let salvoLocation = this.salvoes[i][j].location[k]; 
                        //                        console.log(salvoLocation);
                    }

                }
            }
        }


    },

})
