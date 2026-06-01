package org.example.repository;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    // Fungsi otomatis dari Spring Data JPA untuk mencari user berdasarkan username
    Optional<User> findByUsername(String username);
    List<User> findByRoleAndIsVerifiedFalse(String role);
    List<User> findByIsVerifiedFalse();
}