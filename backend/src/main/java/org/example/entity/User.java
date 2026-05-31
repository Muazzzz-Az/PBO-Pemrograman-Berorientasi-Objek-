package org.example.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "users")
public class User extends BaseEntity { // Pilar OOP: Inheritance (Mewarisi id dari BaseEntity)

    @NotBlank(message = "Username tidak boleh kosong")
    private String username;

    @NotBlank
    @Size(min = 8, message = "Password minimal 8 karakter")
    private String password;

    @NotBlank
    @Email(message = "Format email harus valid")
    private String email;

    // Nama lengkap pengguna
    private String fullName;

    // Role: "user", "artist", "admin"
    private String role;

    // Status verifikasi (untuk artist yang sudah disetujui admin)
    private Boolean isVerified = false;

    // URL foto profil / avatar
    private String avatarUrl;

    // URL banner profil
    private String bannerUrl;

    // Bio singkat pengguna
    private String bio;

    // Encapsulation
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
