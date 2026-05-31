package org.example.entity;

import jakarta.persistence.*;

// Pilar OOP: INHERITANCE — ChatMessage mewarisi id dan timestamps dari BaseEntity
// Pilar OOP: ENCAPSULATION — semua field private, akses via getter/setter
@Entity
public class ChatMessage extends BaseEntity {

    // Nama pengirim (kompatibilitas lama)
    private String sender;

    // ID pengirim (numeric, sesuai frontend)
    private Long senderId;

    // Nama tampilan pengirim
    private String senderName;

    // ID penerima
    private Long receiverId;

    // Room ID unik: format room_buyerId_artistId
    private String roomId;

    // Isi pesan (field utama)
    @Column(columnDefinition = "TEXT")
    private String content;

    // Alias 'text' untuk kompatibilitas dengan frontend ChatBox.js
    @Column(columnDefinition = "TEXT")
    private String text;

    private Boolean isRead = false;
    private String timestamp;

    // Pilar OOP: ENCAPSULATION — Getter & Setter
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    // Pilar OOP: POLYMORPHISM — setContent() juga mengisi text secara otomatis
    public String getContent() { return content; }
    public void setContent(String content) {
        this.content = content;
        if (this.text == null) this.text = content;
    }

    public String getText() { return text != null ? text : content; }
    public void setText(String text) {
        this.text = text;
        if (this.content == null) this.content = text;
    }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
