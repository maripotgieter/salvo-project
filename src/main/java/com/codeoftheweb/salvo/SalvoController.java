package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;


@RestController
@RequestMapping("/api")

public class SalvoController {

    @Autowired
    private GameRepository repo;

    @RequestMapping("/games")
    public List<Object> getAll() {
        return
                repo.findAll().stream().map(game -> toDTO(game)).collect(toList());

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
        return dto;
    }
    private Map<String, Object> makePlayerDTO(Player player) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserName());
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
//
//    private Map<String, Object> fillTheSalvoTypeDTO (Salvo salvo) {
//        Map<String, Object> dto = new LinkedHashMap<String, Object>();
//        dto.put("turn", salvo.getTurn());
//        dto.put("player", salvo.getId());
//        dto.put("locations", salvo.getSalvoLocations());
//        return  dto;
//    }

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

        Map<String, Object> gameViewMap = new HashMap<>();
        gameViewMap. put ("game", toDTO(gamePlayer.getGame()));
        gameViewMap. put ("ships", gamePlayer.getShips().stream()
                .map(ship -> fillShipDTO(ship))
                .collect(toList()));
        gameViewMap. put ("salvoes", gamePlayer.getGame().getGamePlayers().stream()
                .map(gp -> salvoList(gp))
                .collect(toList()));
        return gameViewMap;
    }



}





