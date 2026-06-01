package org.example.service;
import org.example.entity.User;
import org.example.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("user");
        user.setIsVerified(false);
        return userRepository.save(user);
    }

    @Override
    public User registerArtist(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("artist");
        user.setIsVerified(false);
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(existing -> {
            if (updatedUser.getFullName() != null) existing.setFullName(updatedUser.getFullName());
            if (updatedUser.getBio() != null) existing.setBio(updatedUser.getBio());
            if (updatedUser.getAvatarUrl() != null) existing.setAvatarUrl(updatedUser.getAvatarUrl());
            if (updatedUser.getBannerUrl() != null) existing.setBannerUrl(updatedUser.getBannerUrl());
            if (updatedUser.getIsVerified() != null) existing.setIsVerified(updatedUser.getIsVerified());
            if (updatedUser.getRole() != null) existing.setRole(updatedUser.getRole());
            return userRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("User tidak ditemukan dengan id: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        // Menepati janji untuk mengambil semua data user dari repository
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        // Menepati janji untuk mencari user berdasarkan ID
        return userRepository.findById(id);
    }
}
