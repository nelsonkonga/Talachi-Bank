package com.talachibank.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import org.springframework.boot.web.embedded.undertow.UndertowServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import io.undertow.UndertowOptions;

@EnableScheduling
@SpringBootApplication(scanBasePackages = {
		"com.talachibank.api",
		"com.talachibank.signature"
})
public class TalachiBankApplication {

	public static void main(String[] args) {
		SpringApplication.run(TalachiBankApplication.class, args);
	}

	@Bean
	public WebServerFactoryCustomizer<UndertowServletWebServerFactory> containerCustomizer() {
		return factory -> factory.addBuilderCustomizers(builder -> {
			builder.setServerOption(UndertowOptions.MAX_HEADER_SIZE, 1000000);
			builder.setServerOption(UndertowOptions.MAX_ENTITY_SIZE, 10000000L);
			System.out.println("✓✓✓ PROGRAMMATIC UNDERTOW PROPERTY SET: MAX_HEADER_SIZE=1000000 ✓✓✓");
		});
	}

}
