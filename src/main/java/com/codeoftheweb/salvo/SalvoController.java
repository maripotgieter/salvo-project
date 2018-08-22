package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import static java.util.stream.Collectors.toList;


@RestController
@RequestMapping("/api")

public class SalvoController {

    @Autowired
    private GameRepository repo;


    @Autowired
    private PlayerRepository playerRepository;



//
//    public List<Object> getAll() {
//        return
//                repo.findAll().stream().map(game -> toDTO(game)).collect(toList());
//
//    }

//    public Player getCurrentUser (Authentication authentication) {
//        return playerRepository.findByUserName(authentication.getName());
//    }
@RequestMapping("/games")
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

    public Map<String, Object> fillShipDTO (Ship ship) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("type", ship.getType());
        dto.put("location", ship.getLocations());
        return  dto;
    }

    private List<Object> salvoList (GamePlayer gamePlayer) {
        List<Object> salvoList = new ArrayList<>();
        Set<Salvo> salvosSet = gamePlayer.getSalvoes();
        for (Salvo salvo : salvosSet) {
            salvoList.add(fillTheSalvoTypeDTO(salvo));
        }
        return salvoList;
    }

    private Map<String, Object> fillTheSalvoTypeDTO (Salvo salvo) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("turn", salvo.getTurn());
        dto.put("player", salvo.getGamePlayer().getId());
        dto.put("locations", salvo.getSalvoLocations());
        return  dto;
    }

    @Autowired
    private GamePlayerRepository gamePlayerRepository;

    @RequestMapping("/game_view/{id}")
    public Map<String, Object>  findGamePlayerID (@PathVariable Long id) {
        GamePlayer gamePlayer = gamePlayerRepository.findOne(id);
        GamePlayer opponent = getOpponent(gamePlayer);
        Map<String, Object> gameViewMap = new HashMap<>();
        gameViewMap. put ("game", toDTO(gamePlayer.getGame()));
        gameViewMap. put ("ships", gamePlayer.getShips().stream()
                .map(ship -> fillShipDTO(ship))
                .collect(toList()));
        gameViewMap. put ("user_salvoes", salvoList(gamePlayer));
        gameViewMap. put ("enemy_salvoes", salvoList(opponent));
        return gameViewMap;
    }

    private GamePlayer getOpponent (GamePlayer gamePlayer) {

        Set<GamePlayer> gamePlayers = gamePlayer.getGame().getGamePlayers();
        List<GamePlayer> gamePlayerList = new ArrayList<>();
        for (GamePlayer gp : gamePlayers) {
            if (gp != gamePlayer) {
               gamePlayerList.add(gp);
            }
        }
        GamePlayer opponent = gamePlayerList.get(0);
        return opponent;

    }


    @RequestMapping ("/scoreboard")
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
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String name) {
        if (name.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "No name"), HttpStatus.FORBIDDEN);
        }
        Player player = playerRepository.findByUserName(name);
        if (player != null) {
            return new ResponseEntity<>(makeMap("error", "Name is use"), HttpStatus.FORBIDDEN);
        }
        Player newPlayer = playerRepository.save(new User(name));
        return new ResponseEntity<>(makeMap("name", newPlayer.getUserName()), HttpStatus.CREATED);
    }
    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }





}





