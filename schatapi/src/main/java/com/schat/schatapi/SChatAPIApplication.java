package com.schat.schatapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
    "com.schat.schatapi",
    "com.schat.signature"
})
public class SChatAPIApplication {

	public static void main(String[] args) {
		SpringApplication.run(SChatAPIApplication.class, args);
	}

}
