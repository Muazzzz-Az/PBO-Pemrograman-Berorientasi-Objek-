package org.example;

import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PboApplication {
    public static void main(String[] args) {
        SpringApplication.run(PboApplication.class, args);
    }

    // Injektor Data Otomatis (Data Seeder)
    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Mengecek apakah sudah ada akun admin di dalam database
            boolean adminExists = userRepository.findAll().stream()
                    .anyMatch(user -> "admin".equalsIgnoreCase(user.getRole()));

            // Jika belum ada, buatkan otomatis
            if (!adminExists) {
                User admin = new User();
                admin.setUsername("admin_utama");
                admin.setEmail("admin@creartsi.id");
                admin.setFullName("Super Admin");

                // KUNCI KEAMANAN: Password di-hash dengan BCrypt secara otomatis
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("admin");

                // Catatan: Sesuaikan nama setter ini jika di entitas User Anda namanya berbeda
                // (misal: setIsVerified atau setVerified)
                admin.setIsVerified(true);

                userRepository.save(admin);

                System.out.println("=========================================================");
                System.out.println("✅ [AUTO-SEEDER] AKUN ADMIN BERHASIL DIBUAT!");
                System.out.println("✅ Username : admin_utama");
                System.out.println("✅ Password : admin123");
                System.out.println("=========================================================");
            }
        };
    }
}