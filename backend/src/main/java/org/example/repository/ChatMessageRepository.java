package org.example.repository;
import org.example.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Ambil semua pesan dalam satu room chat
    List<ChatMessage> findByRoomIdOrderByIdAsc(String roomId);

    // Ambil pesan antara dua user
    List<ChatMessage> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
        Long senderId, Long receiverId, Long receiverId2, Long senderId2
    );
}
