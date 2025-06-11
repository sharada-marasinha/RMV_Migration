package edu.rmv.config;

import edu.rmv.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtil jwtUtil,UserService userService) {
        return new JwtAuthenticationFilter(jwtUtil,userService);
    }
}
