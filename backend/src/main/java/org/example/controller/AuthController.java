package org.example.controller;
import org.example.entity.User;
import org.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Sesuaikan dengan port React kamu
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/user")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        // @Valid akan mengecek apakah email, password, dll sudah sesuai syarat di Entity User
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        // 1. Buat objek user bayangan agar React bisa baca data.user.role
        Map<String, Object> userDetail = new HashMap<>();
        userDetail.put("username", user.getUsername());
        userDetail.put("role", "USER"); // Sesuaikan: "USER", "Artist", atau "Admin"
        userDetail.put("isVerified", true); // React ngecek isVerified

        // 2. Masukkan ke response utama
        response.put("status", "success");
        response.put("message", "Login berhasil");
        response.put("user", userDetail); // INI KUNCINYA: dibungkus dalam "user"
        response.put("token", "token-dummy-pbo"); // React nyari data.token

        return ResponseEntity.ok(response);
    }
}