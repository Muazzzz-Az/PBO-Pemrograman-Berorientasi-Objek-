package org.example.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

// Pilar OOP: INHERITANCE — Artist mewarisi id dan timestamps dari BaseEntity
// Pilar OOP: ENCAPSULATION — semua field private, akses via getter/setter
@Entity
public class Artist extends BaseEntity {

    @NotBlank(message = "Nama artist tidak boleh kosong")
    private String name;

    // Nama tampilan / nama studio artist
    private String artistName;

    // Genre musik / jenis seni (field lama)
    private String genre;

    // Kategori seni untuk filter di frontend
    private String artCategory;

    private String bio;
    private String profilePicture;

    private Integer followersCount = 0;
    private Double rating = 0.0;
    private Integer totalReviews = 0;

    // Status verifikasi oleh admin
    private Boolean isVerified = false;

    private String username;
    private String instagram;
    private String youtube;

    // Pilar OOP: ENCAPSULATION — Getter & Setter
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // Pilar OOP: POLYMORPHISM — getArtistName() bisa return artistName atau name
    // tergantung data yang tersedia (method berperilaku berbeda sesuai kondisi)
    public String getArtistName() { return artistName != null ? artistName : name; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getArtCategory() { return artCategory != null ? artCategory : genre; }
    public void setArtCategory(String artCategory) { this.artCategory = artCategory; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public Integer getFollowersCount() { return followersCount; }
    public void setFollowersCount(Integer followersCount) { this.followersCount = followersCount; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getInstagram() { return instagram; }
    public void setInstagram(String instagram) { this.instagram = instagram; }

    public String getYoutube() { return youtube; }
    public void setYoutube(String youtube) { this.youtube = youtube; }
}
