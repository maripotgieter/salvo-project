package com.codeoftheweb.salvo;

import javax.persistence.*;
import java.util.*;

@Entity
    public class GamePlayer {

        @Id
        @GeneratedValue(strategy=GenerationType.AUTO)
        private long id;
        private Date date;


        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name="player_id")
        private Player player;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name="game_id")
        private Game game;

        @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
        Set<Ship> ships = new HashSet<>();

        @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
        Set<Salvo> salvoes = new HashSet<>();


    public GamePlayer() { }

        public GamePlayer(Player player, Game game, Date date) {
            this.player = player;
            this.game = game;
            this.date = date;
        }

    public Set<Salvo> getSalvoes() {
        return salvoes;
    }

    public void setSalvoes(Set<Salvo> salvoes) {
        this.salvoes = salvoes;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Player getPlayer() {
            return player;
        }

        public void setPlayer(Player player) {
            this.player = player;
        }

        public Game getGame() {
            return game;
        }

        public void setGame(Game game) {
            this.game = game;
        }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Set<Ship> getShips() {
        return ships;
    }

    public void setShips(Set<Ship> ships) {
        this.ships = ships;
    }

    public Score getScore(){
//        List<Score> scoreList = new ArrayList<>();
//        Set<Score> scoreSet = player.getScores();
//        for (Score score : scoreSet) {
//            if(score.getGame() == game) {
//                scoreList.add(score);
//            }
//        }
//        Score score;
//        if (!scoreList.isEmpty()){
//            score = scoreList.get(0);
//        } else {
//            score = null;
//        }
//        return score;

        return player.getScores().stream().filter(s -> s.getGame() == game).findFirst().orElse(null);
    }
    }

