package org.example.entity;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Artist extends BaseEntity { // Inheritance dari BaseEntity

    @NotBlank(message = "Nama artist tidak boleh kosong")
    private String name;

    private String genre;
    private String bio;

    // Encapsulation (Getter & Setter)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}