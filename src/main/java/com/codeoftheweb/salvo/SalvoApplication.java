package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);

		System.out.println("hello");

    }


	@Bean
	public CommandLineRunner initData(GameRepository gameRepository,
                                      PlayerRepository playerRepository,
                                      GamePlayerRepository gamePlayerRepository,
                                      ShipRepository shipRepository,
                                      SalvoRepository salvoRepository) {
		return (args) -> {


		    Player player1 = new Player ("j.bauer@ctu.gov");
		    Player player2 = new Player ("c.obrian@ctu.gov");
            Player player3 = new Player ("kim_bauer@gmail.com");
            Player player4 = new Player ("t.almeida@ctu.gov");


            playerRepository.save(player1);
            playerRepository.save(player2);
            playerRepository.save(player3);
            playerRepository.save(player4);

            Game game1 = new Game();
            Date date1 = game1.getDate();
            Date date2 = Date.from(date1.toInstant().plusSeconds(3600));
            Date date3 = Date.from(date1.toInstant().plusSeconds(7200));
            Date date4 = Date.from(date1.toInstant().plusSeconds(10800));


            Game game2 = new Game();
            Game game3 = new Game();
            Game game4 = new Game();
            Game game5 = new Game();
            Game game6 = new Game();
            Game game7 = new Game();
            Game game8 = new Game();

            game2.setDate(date2);
            game3.setDate(date3);
            game4.setDate(date4);
            game5.setDate(date1);
            game6.setDate(date1);
            game7.setDate(date1);
            game8.setDate(date2);

			gameRepository.save(game1);
            gameRepository.save(game2);
            gameRepository.save(game3);
            gameRepository.save(game4);
            gameRepository.save(game5);
            gameRepository.save(game6);
            gameRepository.save(game7);
            gameRepository.save(game8);



            GamePlayer gamePlayer1 = new GamePlayer(player1, game1, date1);
            GamePlayer gamePlayer2 = new GamePlayer(player2,game1, date1);
            GamePlayer gamePlayer3 = new GamePlayer(player1, game2, date3);
            GamePlayer gamePlayer4 = new GamePlayer(player2, game2, date3);
            GamePlayer gamePlayer5 = new GamePlayer(player2, game3, date3);
            GamePlayer gamePlayer6 = new GamePlayer(player4, game3, date3);
            GamePlayer gamePlayer7 = new GamePlayer(player2, game4, date3);
            GamePlayer gamePlayer8 = new GamePlayer(player1, game4, date3);
            GamePlayer gamePlayer9 = new GamePlayer(player4, game5, date3);
            GamePlayer gamePlayer10 = new GamePlayer(player1, game5, date3);
            GamePlayer gamePlayer11 = new GamePlayer(player3, game6, date3);
            GamePlayer gamePlayer12 = new GamePlayer(player4, game7, date3);
            GamePlayer gamePlayer13 = new GamePlayer(player3, game8, date3);
            GamePlayer gamePlayer14 = new GamePlayer(player4, game8, date3);

            gamePlayerRepository.save(gamePlayer1);
            gamePlayerRepository.save(gamePlayer2);
            gamePlayerRepository.save(gamePlayer3);
            gamePlayerRepository.save(gamePlayer4);
            gamePlayerRepository.save(gamePlayer5);
            gamePlayerRepository.save(gamePlayer6);
            gamePlayerRepository.save(gamePlayer7);
            gamePlayerRepository.save(gamePlayer8);
            gamePlayerRepository.save(gamePlayer9);
            gamePlayerRepository.save(gamePlayer10);
            gamePlayerRepository.save(gamePlayer11);
            gamePlayerRepository.save(gamePlayer12);
            gamePlayerRepository.save(gamePlayer13);
            gamePlayerRepository.save(gamePlayer14);


            List<String>location1 = Arrays.asList("H2","H3","H4");
            List<String>location2 = Arrays.asList("E1","F1","G1");
            List<String>location3 = Arrays.asList("B4", "B5");
            List<String>location4 = Arrays.asList("B5","C5","D5");
            List<String>location5 = Arrays.asList("F1", "F2");


            Ship ship2 = new Ship("Destroyer", gamePlayer1, location1);
            Ship ship3 = new Ship("Submarine", gamePlayer1, location2);
            Ship ship4 = new Ship("Patrol Boat", gamePlayer1, location3);
            Ship ship5 = new Ship("Destroyer", gamePlayer2, location4);
            Ship ship6 = new Ship("Patrol Boat", gamePlayer2, location5);

            shipRepository.save(ship2);
            shipRepository.save(ship3);
            shipRepository.save(ship4);
            shipRepository.save(ship5);
            shipRepository.save(ship6);


            List<String>salvoLocation1 =  Arrays.asList("B5", "C5", "F1");
            List<String>salvoLocation2 =  Arrays.asList("B4", "B5", "B6");
            List<String>salvoLocation3 =  Arrays.asList("F2", "D5");
            List<String>salvoLocation4 =  Arrays.asList("E1", "H3", "A2");
            List<String>salvoLocation5 =  Arrays.asList("A2", "A4", "G6");
            List<String>salvoLocation6 =  Arrays.asList("B5", "D5", "C7");
            List<String>salvoLocation7 =  Arrays.asList("A3", "H6");
            List<String>salvoLocation8 =  Arrays.asList("C5", "C6");

            Salvo salvo1 = new Salvo(1, gamePlayer1, salvoLocation1);
            Salvo salvo2 = new Salvo(1, gamePlayer2, salvoLocation2);
            Salvo salvo3 = new Salvo (2, gamePlayer1, salvoLocation3);
            Salvo salvo4 = new Salvo (2, gamePlayer2, salvoLocation4);
            Salvo salvo5 = new Salvo (1, gamePlayer1, salvoLocation5);
            Salvo salvo6 = new Salvo (1, gamePlayer2, salvoLocation6);
            Salvo salvo7 = new Salvo (2, gamePlayer1, salvoLocation7);
            Salvo salvo8 = new Salvo (2, gamePlayer2, salvoLocation8);

            salvoRepository.save(salvo1);
            salvoRepository.save(salvo2);
            salvoRepository.save(salvo3);
            salvoRepository.save(salvo4);
            salvoRepository.save(salvo5);
            salvoRepository.save(salvo6);
            salvoRepository.save(salvo7);
            salvoRepository.save(salvo8);

		};

	}

}
