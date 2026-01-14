package com.schat.schatapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(scanBasePackages = {
		"com.schat.schatapi",
		"com.schat.signature"
})
public class TalachiBankApplication {

	public static void main(String[] args) {
		SpringApplication.run(TalachiBankApplication.class, args);
	}

}
