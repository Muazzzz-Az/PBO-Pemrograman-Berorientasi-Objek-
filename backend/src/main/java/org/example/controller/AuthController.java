package org.example.controller;
import org.example.entity.User;
import org.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // Register user biasa
    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            User saved = userService.registerUser(user);
            saved.setPassword(null); // Jangan kembalikan password ke frontend
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Register artist (menunggu verifikasi admin)
    @PostMapping("/register/artist")
    public ResponseEntity<?> registerArtist(@Valid @RequestBody User user) {
        try {
            User saved = userService.registerArtist(user);
            saved.setPassword(null);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pendaftaran artist berhasil. Menunggu verifikasi admin.");
            response.put("user", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Login — cek username DAN password
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userService.findByUsername(loginRequest.getUsername());

        // Cek apakah username ada
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Username atau password salah.");
            return ResponseEntity.status(401).body(error);
        }

        User foundUser = userOpt.get();

        // Cek apakah password cocok (BCrypt)
        if (!passwordEncoder.matches(loginRequest.getPassword(), foundUser.getPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Username atau password salah.");
            return ResponseEntity.status(401).body(error);
        }

        // Login berhasil — kirim data user ke frontend
        Map<String, Object> userDetail = new HashMap<>();
        userDetail.put("id", foundUser.getId());
        userDetail.put("username", foundUser.getUsername());
        userDetail.put("email", foundUser.getEmail());
        userDetail.put("fullName", foundUser.getFullName());
        userDetail.put("role", foundUser.getRole() != null ? foundUser.getRole() : "user");
        userDetail.put("isVerified", foundUser.getIsVerified() != null ? foundUser.getIsVerified() : false);
        userDetail.put("avatarUrl", foundUser.getAvatarUrl());
        userDetail.put("bio", foundUser.getBio());

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Login berhasil");
        response.put("user", userDetail);
        response.put("token", "token-pbo-" + foundUser.getId());

        return ResponseEntity.ok(response);
    }
}
