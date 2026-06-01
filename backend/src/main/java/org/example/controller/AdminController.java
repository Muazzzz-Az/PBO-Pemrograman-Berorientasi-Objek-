package org.example.controller;

import org.example.entity.User;
import org.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint 1: Approve artist
    @PostMapping("/approve-artist/{id}")
    public ResponseEntity<?> approveArtist(@PathVariable Long id) {
        try {
            User updatedUser = userService.approveArtist(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User berhasil menjadi artist");
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Endpoint 2: GET pending artists
    @GetMapping("/pending-artists")
    public ResponseEntity<?> getPendingArtists() {
        try {
            List<User> pendingArtists = userService.getPendingArtists();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", pendingArtists);
            response.put("count", pendingArtists.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Endpoint 3: Reject artist
    @PostMapping("/reject-artist/{id}")
    public ResponseEntity<?> rejectArtist(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String reason = body != null ? body.getOrDefault("reason", "No reason provided") : "No reason provided";
            userService.rejectArtist(id, reason);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Permohonan artist ditolak");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}