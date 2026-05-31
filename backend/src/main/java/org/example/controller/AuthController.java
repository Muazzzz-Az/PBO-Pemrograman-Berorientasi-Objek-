package org.example.controller;
import org.example.entity.User;
import org.example.service.UserService;
import org.springframework.http.ResponseEntity;
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

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Register user biasa
    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        try {
            User saved = userService.registerUser(user);
            // Jangan kembalikan password ke frontend
            saved.setPassword(null);
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

    // Login — role konsisten lowercase: "user", "artist", "admin"
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userService.findByUsername(loginRequest.getUsername());

        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent()) {
            User foundUser = userOpt.get();

            // Buat objek user detail untuk dikirim ke frontend
            Map<String, Object> userDetail = new HashMap<>();
            userDetail.put("id", foundUser.getId());
            userDetail.put("username", foundUser.getUsername());
            userDetail.put("email", foundUser.getEmail());
            userDetail.put("fullName", foundUser.getFullName());
            userDetail.put("role", foundUser.getRole() != null ? foundUser.getRole() : "user");
            userDetail.put("isVerified", foundUser.getIsVerified() != null ? foundUser.getIsVerified() : false);
            userDetail.put("avatarUrl", foundUser.getAvatarUrl());
            userDetail.put("bio", foundUser.getBio());

            response.put("status", "success");
            response.put("message", "Login berhasil");
            response.put("user", userDetail);
            response.put("token", "token-pbo-" + foundUser.getId());
        } else {
            // User belum ada di DB — buat response default agar frontend tetap bisa login
            // (untuk keperluan demo/development)
            Map<String, Object> userDetail = new HashMap<>();
            userDetail.put("id", System.currentTimeMillis());
            userDetail.put("username", loginRequest.getUsername());
            userDetail.put("role", "user");
            userDetail.put("isVerified", false);
            userDetail.put("fullName", loginRequest.getUsername());

            response.put("status", "success");
            response.put("message", "Login berhasil");
            response.put("user", userDetail);
            response.put("token", "token-pbo-guest");
        }

        return ResponseEntity.ok(response);
    }
}
