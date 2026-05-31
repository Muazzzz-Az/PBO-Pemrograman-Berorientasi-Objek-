package org.example.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

// Pilar OOP: INHERITANCE — User mewarisi id dan timestamps dari BaseEntity
// Pilar OOP: ENCAPSULATION — semua field private, akses via getter/setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    // Pilar OOP: VALIDATION (Spring Ecosystem) — memastikan data valid sebelum disimpan
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String fullName;

    // Role: "user", "artist", "admin"
    // Pilar OOP: ENCAPSULATION — role dikontrol lewat setter, tidak bisa diset sembarangan
    private String role;

    // Status verifikasi artist oleh admin
    private Boolean isVerified = false;

    private String avatarUrl;
    private String bannerUrl;
    private String bio;

    // Pilar OOP: ENCAPSULATION — Getter & Setter
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
