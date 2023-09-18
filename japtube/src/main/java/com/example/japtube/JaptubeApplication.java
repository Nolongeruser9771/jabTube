package com.example.japtube;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class JaptubeApplication {

    public static void main(String[] args) {
        SpringApplication.run(JaptubeApplication.class, args);
    }

}
