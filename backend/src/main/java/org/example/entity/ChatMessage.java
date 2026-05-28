package org.example.entity;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;

@Entity
public class ChatMessage extends BaseEntity { // Inheritance dari BaseEntity

    @NotBlank(message = "Nama pengirim tidak boleh kosong")
    private String sender;

    @NotBlank(message = "Isi pesan tidak boleh kosong")
    private String content;

    // Encapsulation (Getter & Setter)
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}