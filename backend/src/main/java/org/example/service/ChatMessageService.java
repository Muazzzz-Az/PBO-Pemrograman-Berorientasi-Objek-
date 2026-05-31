package org.example.service;
import org.example.entity.ChatMessage;
import java.util.List;

// Pilar OOP: ABSTRACTION — Interface mendefinisikan kontrak operasi ChatMessage
public interface ChatMessageService {
    List<ChatMessage> getAllMessages();                        // Ambil semua pesan
    List<ChatMessage> getMessagesByRoomId(String roomId);     // Ambil pesan per room
    ChatMessage sendMessage(ChatMessage message);             // Kirim pesan baru
}
