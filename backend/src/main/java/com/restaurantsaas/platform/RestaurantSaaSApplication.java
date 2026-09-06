package com.restaurantsaas.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class RestaurantSaaSApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestaurantSaaSApplication.class, args);
    }
}
