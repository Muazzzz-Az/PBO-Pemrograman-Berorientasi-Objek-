package org.example.service;
import org.example.entity.User;
import java.util.Optional;
import java.util.List;

// Pilar OOP: ABSTRACTION — Interface menyembunyikan detail implementasi
// Hanya mendefinisikan kontrak/aturan yang harus diikuti oleh implementasinya
// Pilar OOP: POLYMORPHISM — UserServiceImpl mengimplementasikan interface ini
// dengan caranya sendiri (method yang sama, implementasi berbeda)
public interface UserService {
    User registerUser(User user);       // Register sebagai user biasa
    User registerArtist(User user);     // Register sebagai artist (pending verifikasi)
    Optional<User> findByUsername(String username); // Cari user untuk login
    User updateUser(Long id, User user); // Update profil user

    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
}
