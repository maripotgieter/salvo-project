package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static java.util.stream.Collectors.groupingByConcurrent;
import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")

public class SalvoController {

    @Autowired
    private GameRepository repo;


    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    ScoreRepository scoreRepository;

    @RequestMapping(path = "/games", method = RequestMethod.GET)
    private Map<String, Object> toAO(Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        if (authentication != null) {
            dto.put("player", makePlayerDTO(playerRepository.findByUserName(authentication.getName())));
            dto.put("games", repo.findAll().stream().map(game -> toDTO(game)).collect(toList()));
        } else {
            dto.put("games", repo.findAll().stream().map(game -> toDTO(game)).collect(toList()));
        }
        return dto;

    }

    private Map<String, Object> toDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getId());
        dto.put("created", game.getDate());
        dto.put("gamePlayers", game.getGamePlayers().stream()
                .map(gamePlayer -> makeGamePlayerDTO(gamePlayer))
                .collect(toList()));
        return dto;
    }

    private Map<String, Object> makeGamePlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getId());
        dto.put("player", makePlayerDTO(gamePlayer.getPlayer()));
        if (gamePlayer.getScore() != null) {
            dto.put("score", gamePlayer.getScore().getScore());
        }
        return dto;
    }

    private Map<String, Object> makePlayerDTO(Player player) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("username", player.getUserName());
        return dto;
    }

    public Map<String, Object> fillShipDTO(Ship ship) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("type", ship.getType());
        dto.put("location", ship.getLocations());
        return dto;
    }

    private List<Object> salvoList(GamePlayer gamePlayer) {
        List<Object> salvoList = new ArrayList<>();
        Set<Salvo> salvosSet = gamePlayer.getSalvoes();
        for (Salvo salvo : salvosSet) {
            salvoList.add(fillTheSalvoTypeDTO(salvo));
        }
        return salvoList;
    }

    private Map<String, Object> fillTheSalvoTypeDTO(Salvo salvo) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", salvo.getTurn());
        dto.put("player", salvo.getGamePlayer().getId());
        dto.put("locations", salvo.getSalvoLocations());
        return dto;
    }

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

//    @RequestMapping("/game_view/{id}")
//    public Map<String, Object>  findGamePlayerID (@PathVariable Long id) {
//        GamePlayer gamePlayer = gamePlayerRepository.findOne(id);
//        GamePlayer opponent = getOpponent(gamePlayer);
//        Map<String, Object> gameViewMap = new HashMap<>();
//        gameViewMap. put ("game", toDTO(gamePlayer.getGame()));
//        gameViewMap. put ("ships", gamePlayer.getShips().stream()
//                .map(ship -> fillShipDTO(ship))
//                .collect(toList()));
//        gameViewMap. put ("user_salvoes", salvoList(gamePlayer));
//        gameViewMap. put ("enemy_salvoes", salvoList(opponent));
//        return gameViewMap;
//    }

    @RequestMapping(path = "/game_view/{id}", method = RequestMethod.GET)
    public ResponseEntity<Map<String, Object>> findGamePlayerID(@PathVariable Long id,
                                                                Authentication authentication) {

        GamePlayer gamePlayer = gamePlayerRepository.findOne(id);
        if (authentication != null) {
            Player player = gamePlayer.getPlayer();
            Player currentUser = playerRepository.findByUserName(authentication.getName());
            if (player.getId() == currentUser.getId()) {

                Map<String, Object> gameViewMap = new HashMap<>();
                if (gamePlayer.getGame().getGamePlayers().size() == 2) {
                    eachShipIsSunk(gamePlayer);
                    eachShipIsSunk(getOpponent(gamePlayer));
                    GamePlayer opponent = getOpponent(gamePlayer);
                    gameViewMap.put("enemy_salvoes", salvoList(opponent));
                    gameViewMap.put("hits", getHits(gamePlayer));
                    gameViewMap.put("hits_user", getHits(getOpponent(gamePlayer)));
                    gameViewMap.put("enemy_sunked_ships", sunkShips(opponent));
                    gameViewMap.put("myTurn", myTurn(gamePlayer));
                    gameViewMap.put ("gameOver", gameOver(gamePlayer));
                    if (gameOver(gamePlayer) == true && gamePlayer.getScore() == null) {
                        gameViewMap.put("yourScore", calculateScores(gamePlayer));
                    }
                }
                gameViewMap.put("game", toDTO(gamePlayer.getGame()));
                gameViewMap.put("ships", gamePlayer.getShips().stream()
                        .map(ship -> fillShipDTO(ship))
                        .collect(toList()));
                gameViewMap.put("user_salvoes", salvoList(gamePlayer));
                gameViewMap.put("user_sunked_ships", sunkShips(gamePlayer));

                return new ResponseEntity<>(makeMap("gameView", gameViewMap), HttpStatus.CREATED);
            } else {
                return new ResponseEntity<>(makeMap("error", "Not authorized"), HttpStatus.UNAUTHORIZED);
            }
        } else {
            return new ResponseEntity<>(makeMap("error", "Log in"), HttpStatus.UNAUTHORIZED);
        }
    }

    private GamePlayer getOpponent(GamePlayer gamePlayer) {

        Set<GamePlayer> gamePlayers = gamePlayer.getGame().getGamePlayers();
        List<GamePlayer> gamePlayerList = new ArrayList<>();
        for (GamePlayer gp : gamePlayers) {
            if (gp != gamePlayer) {
                gamePlayerList.add(gp);
            }
        }
        GamePlayer opponent = gamePlayerList.get(0);
        System.out.println(opponent);
        return opponent;

    }


    @RequestMapping("/scoreboard")
    public List<Object> getScores() {
        return
                playerRepository.findAll().stream().map(player -> toScoreDTO(player)).collect(toList());
    }

    private Map<String, Object> toScoreDTO(Player player) {
        Map<String, Object> scoreMap = new LinkedHashMap<String, Object>();
        scoreMap.put("player", player.getUserName());
        scoreMap.put("total", player.getScores().stream().mapToDouble(score -> score.getScore()).sum());
        scoreMap.put("wins", player.getScores().stream().filter(score -> score.getScore() == 1.0).count());
        scoreMap.put("losses", player.getScores().stream().filter(score -> score.getScore() == 0.0).count());
        scoreMap.put("ties", player.getScores().stream().filter(score -> score.getScore() == 0.5).count());
        return scoreMap;
    }

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String userName, String password) {
        if (userName.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        } else {
            Player player = playerRepository.findByUserName(userName);
            if (player != null) {
                return new ResponseEntity<>(makeMap("error", "Username in use"), HttpStatus.CONFLICT);
            } else {
                Player newPlayer = playerRepository.save(new Player(userName, password));
                return new ResponseEntity<>(makeMap("id", newPlayer.getId()), HttpStatus.CREATED);
            }
        }
    }

    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createGame(Authentication authentication) {
        Player currentUser = playerRepository.findByUserName(authentication.getName());
        if (currentUser != null) {
            Game newGame = new Game();
            repo.save(newGame);
            GamePlayer newGamePlayer = new GamePlayer(currentUser, newGame, new Date());
            gamePlayerRepository.save(newGamePlayer);
            return new ResponseEntity<>(makeMap("gpId", newGamePlayer.getId()), HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(makeMap("error", "Login"), HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(path = "/games/{id}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(@PathVariable Long id, Authentication authentication) {
        Player currentUser = playerRepository.findByUserName(authentication.getName());
        if (currentUser != null) {
            Game currentGame = repo.findOne(id);
            if (currentGame != null) {
                if (currentGame.getPlayers().size() < 2) {
                    GamePlayer newGamePlayer = new GamePlayer(currentUser, currentGame, new Date());
                    gamePlayerRepository.save(newGamePlayer);
                    return new ResponseEntity<>(makeMap("gpId", newGamePlayer.getId()), HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(makeMap("error", "Game is full!"), HttpStatus.FORBIDDEN);
                }
            } else {
                return new ResponseEntity<>(makeMap("error", "No such game"), HttpStatus.FORBIDDEN);
            }
        } else {
            return new ResponseEntity<>(makeMap("error", "Login"), HttpStatus.UNAUTHORIZED);
        }
    }

    @Autowired
    ShipRepository shipRepository;

    @RequestMapping(path = "/games/players/{id}/ships", method = RequestMethod.POST)
    private ResponseEntity<Map<String, Object>> postShips(@PathVariable Long id,
                                                          Authentication authentication,
                                                          @RequestBody Set<Ship> ships) {
        System.out.println(authentication.getName());
        GamePlayer gamePlayer = gamePlayerRepository.findOne(id);
        for (Ship ship : ships) {
            ship.setGamePlayer(gamePlayer);
            shipRepository.save(ship);
        }
        return new ResponseEntity<>(makeMap("", ""), HttpStatus.CREATED);
    }

    @Autowired
    SalvoRepository salvoRepository;

    @RequestMapping(path = "/games/players/{id}/salvos", method = RequestMethod.POST)
    private ResponseEntity<Map<String, Object>> postSalvoes(@PathVariable Long id,
                                                            Authentication authentication,
                                                            @RequestBody Salvo salvo) {
        if (authentication != null) {
            System.out.println(authentication.getName());
            Player currentUser = playerRepository.findByUserName(authentication.getName());
            System.out.println(currentUser.getUserName());
            if (currentUser != null) {
                GamePlayer gamePlayer = gamePlayerRepository.getOne(id);
                System.out.println(gamePlayer.getPlayer().getUserName());
                if (gamePlayer != null) {
                    System.out.println("gp not null");
                        if (gamePlayer.getPlayer().getUserName() == currentUser.getUserName()) {

                            salvo.setTurn(getLastTurn(gamePlayer));
                                salvo.setGamePlayer(gamePlayer);
                                salvoRepository.save(salvo);

                            return new ResponseEntity<>(makeMap("success", "salvoes created"), HttpStatus.CREATED);
                        } else {
                            return new ResponseEntity<>(makeMap("error", ""), HttpStatus.UNAUTHORIZED);
                        }
                } else {
                    return new ResponseEntity<>(makeMap("error", ""), HttpStatus.UNAUTHORIZED);
                }
            } else {
                return new ResponseEntity<>(makeMap("error", ""), HttpStatus.UNAUTHORIZED);

            }
        } else {
            return new ResponseEntity<>(makeMap("error", "Login"), HttpStatus.UNAUTHORIZED);
        }
    }

    private Integer getLastTurn(GamePlayer gamePlayer) {
        Integer lastTurn = 0;
        for (Salvo salvoe : gamePlayer.getSalvoes()) {
            Integer turn = salvoe.getTurn();
            if (lastTurn < turn) {
                lastTurn = turn;
            }
        }
        return lastTurn + 1;
    }

    private Boolean myTurn(GamePlayer gamePlayer) {
        Boolean myTurn;
        GamePlayer opponent = getOpponent(gamePlayer);
        if (gamePlayer.getId() < opponent.getId()) {
            if (getLastTurn(gamePlayer) < getLastTurn(opponent) || getLastTurn(gamePlayer) == getLastTurn(opponent)) {
                myTurn = true;
            } else {
                myTurn = false;
            }
        } else {
            if (getLastTurn(gamePlayer) < getLastTurn(opponent) ) {
                myTurn = true;
            } else {
                myTurn = false;
            }
        }
        return myTurn;
    }

    private List<String> getShipLocations (GamePlayer gamePlayer) {
        List<String> shipLocations = new ArrayList<>();
        Set<Ship> ships = gamePlayer.getShips();
        for (Ship ship: ships) {
            List<String> eachLocation = ship.getLocations();
            for (String location: eachLocation) {
                shipLocations.add(location);
            }
        }
        return shipLocations;
    }

    private List<String> getSalvoLocations (GamePlayer gamePlayer) {
        List<String> salvoLocations = new ArrayList<>();
        Set<Salvo> salvos = gamePlayer.getSalvoes();
        for (Salvo salvo: salvos) {
            List<String> eachLocation = salvo.getSalvoLocations();
            for (String location: eachLocation) {
                salvoLocations.add(location);
            }
        }
        return salvoLocations;
    }

    private List<String> getHits (GamePlayer gamePlayer) {
        List<String> getHits = new ArrayList<>();
        List<String> shipLocations = getShipLocations(getOpponent(gamePlayer));
        List<String> salvoLocations = getSalvoLocations(gamePlayer);
        for (String salvoLocation: salvoLocations) {
            for (String shipLocation: shipLocations) {
                if (salvoLocation == shipLocation) {
                    getHits.add(salvoLocation);
                }
            }
        }
        return getHits;
    }

    private Boolean shipIsSunk (List<String> SalvoLocations, Ship ship) {

        boolean shipIsSunk = ship.getLocations().stream()
                .allMatch(locations -> SalvoLocations.contains(locations));
        if(shipIsSunk) {
            ship.setSunk(true);
            shipRepository.save(ship);
        }
        return shipIsSunk;
    }

    private void eachShipIsSunk (GamePlayer gamePlayer) {
        GamePlayer opponent = getOpponent(gamePlayer);
        Set<Ship> opponentShips = opponent.getShips();
        List<String> gameplayerSalvoes = getSalvoLocations(gamePlayer);
        opponentShips
                .stream()
                .filter(ship -> !ship.getSunk())
                .forEach(ship -> shipIsSunk(gameplayerSalvoes,ship));
    }

    private List<Object> sunkShips (GamePlayer gamePlayer) {
        List<Object> sunkenShips = new ArrayList<>();
        Set<Ship> gamePlayerShips = gamePlayer.getShips();
        for (Ship gamePlayerShip : gamePlayerShips) {
            if(gamePlayerShip.getSunk()) {
              sunkenShips.add(fillShipDTO(gamePlayerShip));
            }
        } return sunkenShips;

//        return gamePlayer.getShips().stream().filter(ship -> ship.getSunk()).map(ship -> fillShipDTO(ship)).collect(toList());

    }


    private Boolean gameOver (GamePlayer gamePlayer) {
        if (sunkShips(gamePlayer).size() == 4 || sunkShips(getOpponent(gamePlayer)).size() == 4){
            if (getLastTurn(gamePlayer) == getLastTurn(getOpponent(gamePlayer))){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    private Double calculateScores (GamePlayer gamePlayer) {
            if (sunkShips(gamePlayer).size() == 4 && sunkShips(getOpponent(gamePlayer)).size() != 4) {
                scoreRepository.save(new Score(gamePlayer.getPlayer(), gamePlayer.getGame(), 0.0, new Date()));
                return 0.0;
            }
            if (sunkShips(gamePlayer).size() != 4 && sunkShips(getOpponent(gamePlayer)).size() == 4) {
                scoreRepository.save(new Score(gamePlayer.getPlayer(), gamePlayer.getGame(), 1.0, new Date()));
                return 1.0;
            }
            if (sunkShips(gamePlayer).size() == sunkShips(getOpponent(gamePlayer)).size()) ;
            {
                scoreRepository.save(new Score(gamePlayer.getPlayer(), gamePlayer.getGame(), 0.5, new Date()));
                return 0.5;
            }

    }
//    @RequestMapping(value="/games/players/{id}/ships", method=RequestMethod.POST)
//    public ResponseEntity<Map<String, Object>> createShips (@PathVariable Long id,
//                                                            Authentication authentication,
//                                                            @RequestBody Set<Ship> ships) {
//        if (authentication != null) {
//            System.out.println(authentication.getName());
//        Player currentUser = playerRepository.findByUserName(authentication.getName());
//            System.out.println(currentUser.getUserName());
//        if (currentUser != null) {
//            GamePlayer gamePlayer = gamePlayerRepository.getOne(id);
//            System.out.println(gamePlayer.getPlayer().getUserName());
//            if (gamePlayer != null) {
//                System.out.println("gp not null");
//
////                if (gamePlayer.getPlayer().getUserName() == currentUser.getUserName()) {
//                    System.out.println(gamePlayer.getShips().size());
//                    if (gamePlayer.getShips().size() == 0) {
//                        System.out.println("hey");
//                        for (Ship ship : ships) {
//                            ship.setGamePlayer(gamePlayer);
//                            shipRepository.save(ship);
//                        }
//                        return new ResponseEntity<>(makeMap("success", "ships created"), HttpStatus.CREATED);
//                    } else {return new ResponseEntity<>(makeMap("error", "Already placed ships"), HttpStatus.FORBIDDEN);}
////                } else {return new ResponseEntity<>(makeMap("error", ""), HttpStatus.UNAUTHORIZED);}
//            } else { return new ResponseEntity<>(makeMap("error", ""), HttpStatus.UNAUTHORIZED);
//
//            }
//        } else {
//            return new ResponseEntity<>(makeMap("error", "Login"), HttpStatus.UNAUTHORIZED);
//        }
//        } else {
//            return new ResponseEntity<>(makeMap("error", "Login"), HttpStatus.UNAUTHORIZED);
//        }
//
//    }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
}





