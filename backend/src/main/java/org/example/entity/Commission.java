package org.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Pilar OOP: INHERITANCE — Commission mewarisi id dan timestamps dari BaseEntity
// Pilar OOP: ENCAPSULATION — semua field private, akses via getter/setter
@Entity
public class Commission extends BaseEntity {

    // Pilar OOP: VALIDATION — memastikan data valid (Spring Ecosystem)
    @NotBlank(message = "Commission title is required")
    private String title;

    private String category;
    private String description;

    @NotNull(message = "Harga tidak boleh kosong")
    private Double priceFrom;

    private Double priceTo;
    private String turnaround;
    private Integer slots = 5;
    private Integer slotsLeft = 5;
    private Integer revisions = 2;
    private Boolean isOpen = true;
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String sampleImages;

    @Column(columnDefinition = "TEXT")
    private String includes;

    private Boolean hasMusic = false;

    @Column(columnDefinition = "TEXT")
    private String musicFile;

    @Column(columnDefinition = "TEXT")
    private String terms;

    // Relasi ke artist pemilik komisi
    private Long artistId;
    private String artistName;

    // Field lama untuk kompatibilitas
    private String imageUrl;

    // Pilar OOP: ENCAPSULATION — Getter & Setter
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPriceFrom() { return priceFrom; }
    public void setPriceFrom(Double priceFrom) { this.priceFrom = priceFrom; }

    // Pilar OOP: POLYMORPHISM — getPrice() sebagai alias getProceFrom()
    // untuk kompatibilitas dengan CommissionList.js yang pakai comm.price
    public Double getPrice() { return priceFrom; }

    public Double getPriceTo() { return priceTo; }
    public void setPriceTo(Double priceTo) { this.priceTo = priceTo; }

    public String getTurnaround() { return turnaround; }
    public void setTurnaround(String turnaround) { this.turnaround = turnaround; }

    public Integer getSlots() { return slots; }
    public void setSlots(Integer slots) { this.slots = slots; }

    public Integer getSlotsLeft() { return slotsLeft; }
    public void setSlotsLeft(Integer slotsLeft) { this.slotsLeft = slotsLeft; }

    public Integer getRevisions() { return revisions; }
    public void setRevisions(Integer revisions) { this.revisions = revisions; }

    public Boolean getIsOpen() { return isOpen; }
    public void setIsOpen(Boolean isOpen) { this.isOpen = isOpen; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getSampleImages() { return sampleImages; }
    public void setSampleImages(String sampleImages) { this.sampleImages = sampleImages; }

    public String getIncludes() { return includes; }
    public void setIncludes(String includes) { this.includes = includes; }

    public Boolean getHasMusic() { return hasMusic; }
    public void setHasMusic(Boolean hasMusic) { this.hasMusic = hasMusic; }

    public String getMusicFile() { return musicFile; }
    public void setMusicFile(String musicFile) { this.musicFile = musicFile; }

    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
