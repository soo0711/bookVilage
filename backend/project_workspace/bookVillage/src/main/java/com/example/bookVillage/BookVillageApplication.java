package com.example.bookVillage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.bookVillage.web") // WebController가 위치한 패키지 경로
public class BookVillageApplication {

	public static void main(String[] args) {
		SpringApplication.run(BookVillageApplication.class, args);
	}

}
