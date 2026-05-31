package org.example.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Artist extends BaseEntity { // Inheritance dari BaseEntity

    @NotBlank(message = "Nama artist tidak boleh kosong")
    private String name;

    // artistName alias (nama tampilan / nama studio)
    private String artistName;

    private String genre;

    // artCategory untuk filter di frontend
    private String artCategory;

    private String bio;

    // URL foto profil
    private String profilePicture;

    // Jumlah followers
    private Integer followersCount = 0;

    // Rating rata-rata (0.0 - 5.0)
    private Double rating = 0.0;

    // Total ulasan
    private Integer totalReviews = 0;

    // Status verifikasi oleh admin
    private Boolean isVerified = false;

    // Username unik artist
    private String username;

    // Social media
    private String instagram;
    private String youtube;

    // Encapsulation (Getter & Setter)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

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
