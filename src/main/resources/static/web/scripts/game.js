//$.post("/api/login", { userName: "c.obrian@ctu.gov", password: "222" }).done(function() { console.log("logged in!"); })
//$.post("/api/login", { userName: "c.obrian@ctu.gov", password: "42" }).done(function() { console.log("logged in!"); })
//$.post("/api/logout").done(function() { console.log("logged out"); })
//
//$.post({
//  url: "/games/players/1/ships", 
//  data: JSON.stringify ({
//                "salvo": [{
//                    "turn": "1",
//                    "locations": ["A1"]
//                                        }, {
//                    "type": "patrolboat",
//                    "location": ["H5", "H6"]
//
//                                        }]
//            }),
//  dataType: "text",
//  contentType: "application/json"
//})
//.done(function (response, status, jqXHR) {
//  alert( "Ships added: " + response );
//})
//.fail(function (jqXHR, status, httpError) {
//  alert("Failed to add ships: " + textStatus + " " + httpError);
//})

var main = new Vue({
    el: '#main',
    data: {
        columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        game: [],
        id: '',
        playersOne: [],
        playersTwo: [],
        playerTwoSalvo: [],
        playerTwoTurns: [],
        shipUserLocations: [],
        shipEnemyLocations: [],
        imageArray: ["1009975.png", "pirate.png", "Pirate_face.png", "pirate_face_2.png", "pirate_face_3.png", "pirate_face_5.png", "1009995.png", "parrot different.png"],
        image: '',
        path: 0,
        arrayOfShips: [],
        show: true,
        gpId: [],
        salvoGrid: false,
        salvoes: [],
        salvoesToPost: [],
        win: false,
        lose: false,
        tie: false,
        notYourTurn: true,
    },
    created: function () {
        this.findTheID();
        this.start(this.id);
        this.shuffleImageArray('pirate_image');
        this.shuffleImageArray('other_pirate_image');
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
                    main.salvoes = [];
                    main.gameInformation();
                    if (main.game.gameView.myTurn == true){
                        main.notYourTurn = true;
                    } else {
                        main.notYourTurn = false;
                    }

                    if (main.game.gameView.ships.length != 0) {
                        main.show = false;
                        main.salvoGrid = true;
                        main.printShips();
                        main.printSalvos(main.game.gameView.user_salvoes, "E");
                        if (main.game.gameView.enemy_salvoes) {
                            main.printSalvos(main.game.gameView.enemy_salvoes, "U");
                            main.printHits(main.game.gameView.hits, "E");
                            main.printHits(main.game.gameView.hits_user, "U");

                            if (main.game.gameView.gameOver == true) {
                                main.gameScores();
                            } else {
//                                document.getElementById("shoot-the-salvo").classList.remove("zoom");
                                main.gameWait(id);
                            }
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        gameWait: function (id) {
            if (main.game.gameView.myTurn == false) {
                console.log("waiting....")
                setTimeout(function(){ main.start(id) }, 3000); //with a timeout of a few seconds  
//                document.getElementById("shoot-the-salvo").classList.add("zoom");
            } else {
                
            }
        },
        printShips: function () {
            let ships = this.game.gameView.ships;
            for (var i = 0; i < ships.length; i++) {
                for (var j = 0; j < ships[i].location.length; j++) {
                    let shipLocation = this.game.gameView.ships[i].location[j];
                    this.shipUserLocations.push(shipLocation);
                    document.getElementById("U" + shipLocation).setAttribute("class", "cell ship-location");
                }
            }
        },
        findTheID: function () {
            this.id = location.search.split("=")[1];
        },
        gameInformation: function () {
            var empty = [];
            let gamePlayers = this.game.gameView.game.gamePlayers;
            for (var i = 0; i < gamePlayers.length; i++) {
                var player = gamePlayers[i].player.username;
                if (this.id == gamePlayers[i].id) {
                    this.playersOne = player + " (You)";
                } else {
                    this.playersTwo = player;
                }
                empty.push(player);
                this.players = empty;
            }
        },
        printSalvos: function (salvoes, tbl) {
//            console.log(salvoes)
            for (var i = 0; i < salvoes.length; i++) {
                let salvoArray = salvoes[i].locations;
                for (var j = 0; j < salvoArray.length; j++) {
                    let cell = document.getElementById(tbl + salvoArray[j]);
                    cell.innerHTML = salvoes[i].turn;
                    cell.setAttribute("class", "cell salvo-location");
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
        logout: function () {
            var fetchConfig =
                fetch("/api/logout", {}).then(function (json) {
                    var data = json;
                    console.log(data);
                    location.href = "http://localhost:8080/web/games.html";

                })
        },
        postShips: function (shipData, id) {
            if (shipData.length == 4) {
                main.show = false;
                main.salvoGrid = true;
                var fetchConfig =
                    fetch("/api/games/players/" + id + "/ships", {
                        credentials: 'include',
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(shipData)
                    }).then(response => {
                        console.log(response)
                        response.json()
                            .then(json => {
                                this.path = 1;
                                main.start(id);
                            })
                    })

                    .catch(function (error) {
                        console.log(error);
                    })
            } else {
                alert("PLEASE PLACE SHIPS!")
            }
        },
        postSalvoes: function (salvoInfo, id) {
            var fetchConfig =
                fetch("/api/games/players/" + id + "/salvos", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(salvoInfo)

                }).then(response => {
                    console.log(response)
                    
                    response.json()
                        .then(json => {
                            console.log(json);
                            console.log(main.salvoesToPost)
                            main.start(id);
                        })
                })

                .catch(function (error) {
                    console.log(error);
                })
        },
        getSalvoId: function (id) {
            var cellId = id;
            var dataCell = document.getElementById("E" + id);

            dataCell.classList.add("salvo-location");
            if (main.salvoes.indexOf(cellId) == -1) {
                main.salvoes.push(cellId)
            } else {
                var index = main.salvoes.indexOf(cellId);
                if (index > -1) {
                    main.salvoes.splice(index, 1)
                    var toBeRemoved = document.getElementById("E" + id);
                    toBeRemoved.classList.remove("salvo-location");
                }
            }
            main.salvoRules(main.salvoes);
            var newSalvoes = {
                salvoLocations: main.salvoes,
            }
            main.salvoesToPost = newSalvoes;
        },
        salvoRules: function (salvoes) {
            if (salvoes.length > 5) {
                var lastElement = salvoes.pop();
                console.log(lastElement);
                var toBeRemoved = document.getElementById("E" + lastElement);
                toBeRemoved.classList.remove("salvo-location");
                alert("You can only fire 5 salvos!")

            }
        },
        gameScores: function () {
            let score = main.game.gameView.yourScore;
            if (score == 1) {
                main.win = true;
            } else if (score == 0) {
                main.lose = true;
            } else if (score == 0.5) {
                main.tie = true;
            }
        },
        printHits: function (hitsArray, tbl) {
            for (var i = 0; i < hitsArray.length; i++) {
                let cell = document.getElementById(tbl + hitsArray[i]);
                cell.setAttribute("class", 'cell hits');

            }
        }
    },
})


var arrayOfShips = [];
var rowsLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var columnsNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
var allGridCellsArray = [];

getGamePlayerId();
calculatingTheGridArray();


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    if (ev.toElement.classList.contains("cell") && !ev.toElement.classList.contains("ship-located")) {
        var _target = $("#" + ev.target.id);
        $("#" + ev.target.id).addClass("ship-located")
        if ($(_target).hasClass("noDrop")) {
            ev.preventDefault();
        } else {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
            console.log(document.getElementById(data))
            fillArrayOfShipsToPost(ev.target.id);
        }
    }
}

function fillArrayOfShipsToPost(id) {

    var cell = document.getElementById(id);
    var ship = cell.childNodes[0];

    var shipInformation = ship.getAttribute("class");
    var shipType = shipInformation.split(" ")[0];

    var shipDirection = shipInformation.split(" ")[1];

    var letterNumberArray = id.split(/(?=[1-9])/);

    var elementLetter = letterNumberArray[0];
    var slicedLetter = elementLetter.slice(1);

    var number = (letterNumberArray[1]);
    var elementNumber = parseInt(number);

    var loop;
    if (shipType == "sloop") {
        loop = 4;
    }
    if (shipType == "cutter") {
        loop = 3
    }
    if (shipType == "galleon") {
        loop = 3
    }
    if (shipType == "carrack") {
        loop = 4
    }

    var locations = [];
    locations.push(slicedLetter + elementNumber)
    for (var i = 0; i < loop; i++) {
        if (shipDirection == "horizontal") {
            elementNumber++;
            locations.push(slicedLetter + elementNumber)
        } else {
            slicedLetter = rowsLetters[rowsLetters.indexOf(slicedLetter) + 1]
            locations.push(slicedLetter + elementNumber)
        }
    }

    var newShip = {
        type: shipType,
        locations: locations
    }

    for (var i = 0; i < arrayOfShips.length; i++) {
        if (arrayOfShips[i].type == newShip.type) {
            var index = arrayOfShips.indexOf(arrayOfShips[i]);
            if (index > -1) {
                arrayOfShips.splice(index, 1);
            }
        }
    }
    arrayOfShips.push(newShip);

    let error = gridDropAllowances(arrayOfShips)
    if (error) {
        putDragabeShipBack(ship, shipType)
    }
    main.arrayOfShips = arrayOfShips;
    //    console.log(main.arrayOfShips)
    //    if (arrayOfShips.length == 4) {
    //       
    //        main.postShips(arrayOfShips, main.gpId);
    //    }
}

function rotate(id) {
    const cell = document.getElementById(id);

    if (cell.classList.contains("horizontal")) {
        cell.classList.remove("horizontal");
        cell.classList.add("vertical")
        rotationClass = "vertical";

    } else {
        cell.classList.add("horizontal");
        cell.classList.remove("vertical")
        rotationClass = "horizontal";
    }
    fillArrayOfShipsToPost(cell.parentNode.id)
}

function calculatingTheGridArray() {
    var empty = [];
    for (var i = 0; i < rowsLetters.length; i++) {
        for (var j = 0; j < columnsNumbers.length; j++) {
            var gridCell = rowsLetters[i] + columnsNumbers[j];
            empty.push(gridCell);
            allGridCellsArray = empty;
        }
    }
}

function gridDropAllowances(ships) {
    var cellAlredyInUse = [];
    let error = false;
    for (var i = 0; i < ships.length; i++) {
        let ship = ships[i];
        for (let j = 0; j < ship.locations.length; j++) {
            let eachLocation = ship.locations[j];
            if (allGridCellsArray.includes(eachLocation)) {
                if (!cellAlredyInUse.includes(eachLocation)) {
                    cellAlredyInUse.push(eachLocation);
                } else {
                    var index = ships.indexOf(ship);
                    if (index > -1) {
                        ships.splice(index, 1)
                    }
                    error = true;
                }
            } else {
                var index = ships.indexOf(ship);
                if (index > -1) {
                    ships.splice(index, 1)
                }
                error = true;
            }
        }
    }
    return error;
}

function putDragabeShipBack(ship, shipType) {

    if (shipType == "sloop") {
        document.getElementById("container-sloop").appendChild(ship);
    }
    if (shipType == "cutter") {
        document.getElementById("container-cutter").appendChild(ship);
    }
    if (shipType == "galleon") {
        document.getElementById("container-galleon").appendChild(ship);
    }
    if (shipType == "carrack") {
        document.getElementById("container-carrack").appendChild(ship);
    }
}

function getGamePlayerId() {
    var gamePlayerId = window.location.search.split("&")[0].split("=")[1];
    main.gpId = gamePlayerId;

}
