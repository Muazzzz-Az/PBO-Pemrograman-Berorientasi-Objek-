package org.example.security;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Dimatikan agar React bisa mengirim data POST
                .cors(cors -> cors.configure(http)) // Mengizinkan komunikasi dengan React
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Akses Login/Register
                        .requestMatchers("/api/artists/**").permitAll() // Akses data Artist
                        .requestMatchers("/api/chat/**").permitAll() // BARIS BARU: Akses fitur ChatBox
                        .anyRequest().authenticated() // Sisanya wajib login
                )
                .httpBasic(basic -> {});

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Syarat keamanan: Password dienkripsi dengan BCrypt
    }
}