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

    private String role; // Untuk membedakan "ROLE_USER" dan "ROLE_ADMIN"

    // Encapsulation
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}