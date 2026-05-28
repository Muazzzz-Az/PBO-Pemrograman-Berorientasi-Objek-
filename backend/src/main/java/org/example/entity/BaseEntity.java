package org.example.entity;
import jakarta.persistence.*;

@MappedSuperclass
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Pilar OOP: Encapsulation (Menyembunyikan data dengan private & menggunakan Getter/Setter)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}