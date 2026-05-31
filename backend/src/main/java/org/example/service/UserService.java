package org.example.service;
import org.example.entity.User;
import java.util.Optional;

// Pilar OOP: Abstraction
public interface UserService {
    User registerUser(User user);
    User registerArtist(User user);
    Optional<User> findByUsername(String username);
    User updateUser(Long id, User user);
}
