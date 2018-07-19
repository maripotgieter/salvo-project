package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;


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

    }





