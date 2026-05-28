package org.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Menandakan ini konfigurasi keamanan utama
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Dimatikan agar React bisa mengirim data POST
                .cors(Customizer.withDefaults()) // Mengizinkan komunikasi dengan React
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Akses Login/Register
                        .requestMatchers("/api/artists/**").permitAll() // Akses data Artist
                        .requestMatchers("/api/chat/**").permitAll() // BARIS BARU: Akses fitur ChatBox
                        .requestMatchers("/api/commissions/**").permitAll() // Akses fitur Komisi kita
                        .requestMatchers("/h2-console/**").permitAll() // Izin akses database H2
                        .anyRequest().authenticated() // Sisanya wajib login
                )
                // Baris tambahan agar H2 Console bisa muncul di browser
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Syarat keamanan: Password dienkripsi dengan BCrypt
    }
}