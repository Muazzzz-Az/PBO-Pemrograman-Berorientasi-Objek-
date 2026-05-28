package org.example.service;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService { // Pilar OOP: Polymorphism

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user) {
        // Enkripsi password sebelum disimpan ke database
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Set role standar untuk pengguna baru
        user.setRole("ROLE_USER");
        return userRepository.save(user);
    }
}