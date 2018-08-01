package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;
    private Date finishDate;
    private Double score;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game_id")
    private Game game;

    public Score() { }

    public long getId() {
        return id;
    }

    public Date getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(Date finishDate) {
        this.finishDate = finishDate;
    }

    public Score(Player player, Game game,double score,Date finishDate ) {
        this.finishDate = finishDate;
        this.score = score;
        this.player = player;
        this.game = game;
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


    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }


}
