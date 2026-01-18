package com.CollegePlacement.config; // Using the package name you provided

import com.CollegePlacement.service.CustomUserDetailsService;
import com.CollegePlacement.service.JwtUtil;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // <-- Added
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// CORS Imports:
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;
import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity // <-- Ensure this is present for security config to work
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userService;

    @Bean
    public JwtAuthFilter jwtAuthFilter() {
        return new JwtAuthFilter(jwtUtil, userService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // 1. CONFIGURE CORS: Apply the configuration from the bean below
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // <-- Added for CORS fix
            
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // CRITICAL CORS FIX: Allow all OPTIONS preflight requests to pass immediately
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // <-- Added for CORS fix
                
                // Existing Auth Rules
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/admin/create-admin").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/student/**").hasRole("STUDENT")
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable());

        http.addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    // --- CORS CONFIGURATION SOURCE BEAN ---
    // This bean defines the explicit CORS rules for Spring Security to use.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ** IMPORTANT: REPLACE WITH YOUR FRONTEND URL **
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
        
        // Allow the standard methods, including OPTIONS for the preflight check
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow all headers (including Authorization header for JWTs)
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        
        // Allow cookies and authentication headers
        configuration.setAllowCredentials(true);
        
        configuration.setMaxAge(3600L); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}