var main = new Vue({
    el: '#main',
    data: {
        columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        gpId: [],
    },
    created: function () {

    },
    methods: {
        postShips: function (shipData, id) {
            console.log(id);
            var fetchConfig =
                fetch("/games/players/" + id + "/ships", {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: JSON.stringify(shipData)

                }).then(response => {
                    console.log(response)
                    response.json()
                        .then(json => {
                            console.log(json);
                        })
                })

                .catch(function (error) {
                    console.log(error);
                })
        },
        //                shipData: function () {
        //                    var empty = [];
        //                    var data = {
        //                        "ship": [{
        //                            "type": "destroyer",
        //                            "locations": ["A1", "B1", "C1"]
        //                                            }, {
        //                            "type": "patrolboat",
        //                            "location": ["H5", "H6"]
        //    
        //                                            }]
        //                    };
        //                    console.log(data);
        //                    main.placeShips(data);
        //                },
        logout: function () {
            var fetchConfig =
                fetch("/api/logout", {}).then(function (json) {
                    var data = json;
                    console.log(data);
                    location.href = "http://localhost:8080/web/games.html";

                })
        },
    },
});

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
    console.log(shipDirection);

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
    console.log(arrayOfShips);
    main.postShips(arrayOfShips, main.gpId);
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
    console.log(window.location.search.split("&")[0].split("=")[1]);
    main.gpId = gamePlayerId;

}
