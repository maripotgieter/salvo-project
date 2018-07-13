package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);

		System.out.println("hello");

	}

	@Bean
	public CommandLineRunner initData(GameRepository repository) {
		return (args) -> {
			// save a couple of customers
			Game game1 = new Game();
			Game game2 = Game.from(game1.toInstant().plusSeconds(3600));
			Game game3 = Game.from(game2.toInstant().plusSeconds(3600));


			repository.save(new Game(game1));
			repository.save(new Game(game2));
			repository.save(new Game(game3);

		};

	}

}
