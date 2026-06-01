package org.example.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

// Pilar OOP: ABSTRACTION — Kelas abstrak yang menyembunyikan detail implementasi
// dan hanya menampilkan kontrak dasar (id, timestamps) untuk semua entity
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Pilar OOP: ENCAPSULATION — field private, akses via getter/setter

    // Timestamp otomatis saat data dibuat
    private LocalDateTime createdAt;

    // Timestamp otomatis saat data diupdate
    private LocalDateTime updatedAt;

    // Lifecycle callback JPA — set otomatis sebelum insert
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Lifecycle callback JPA — set otomatis sebelum update
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Pilar OOP: ENCAPSULATION — Getter & Setter melindungi akses langsung ke field
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
