package org.example.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Commission extends BaseEntity { // Inheritance dari BaseEntity

    @NotBlank(message = "Judul komisi tidak boleh kosong")
    private String title;

    private String category;

    private String description;

    // Harga mulai dari
    @NotNull(message = "Harga tidak boleh kosong")
    private Double priceFrom;

    // Harga maksimal (opsional)
    private Double priceTo;

    // Estimasi waktu pengerjaan
    private String turnaround;

    // Jumlah slot tersedia
    private Integer slots = 5;

    // Sisa slot
    private Integer slotsLeft = 5;

    // Jumlah revisi
    private Integer revisions = 2;

    // Status buka/tutup komisi
    private Boolean isOpen = true;

    // URL gambar cover
    private String coverImage;

    // URL gambar sampel (disimpan sebagai JSON string)
    @Column(columnDefinition = "TEXT")
    private String sampleImages;

    // Apa saja yang termasuk dalam paket (disimpan sebagai JSON string)
    @Column(columnDefinition = "TEXT")
    private String includes;

    // Apakah ada file musik
    private Boolean hasMusic = false;

    // URL file musik
    @Column(columnDefinition = "TEXT")
    private String musicFile;

    // Syarat dan ketentuan
    @Column(columnDefinition = "TEXT")
    private String terms;

    // ID artist pemilik komisi
    private Long artistId;

    // Nama artist pemilik komisi
    private String artistName;

    // Field lama untuk kompatibilitas
    private String imageUrl;

    // Encapsulation (Getter & Setter)
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPriceFrom() { return priceFrom; }
    public void setPriceFrom(Double priceFrom) { this.priceFrom = priceFrom; }

    // Alias untuk kompatibilitas dengan CommissionList.js yang pakai comm.price
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
