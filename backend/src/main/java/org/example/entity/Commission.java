package org.example.entity;

import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Commission extends BaseEntity { // Inheritance dari BaseEntity

    @NotBlank(message = "Judul komisi tidak boleh kosong")
    private String title;

    private String category;

    @NotNull(message = "Harga tidak boleh kosong")
    private Double price;

    private String description;
    private String imageUrl;

    // Encapsulation (Getter & Setter)
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}