package org.example.service;
import org.example.entity.User;

// Pilar OOP: Abstraction (Menyembunyikan detail proses, hanya membuat kontrak/aturan)
public interface UserService {
    User registerUser(User user);
}