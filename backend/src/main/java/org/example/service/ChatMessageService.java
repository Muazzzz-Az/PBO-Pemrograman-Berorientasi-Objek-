package org.example.service;
import org.example.entity.ChatMessage;
import java.util.List;

public interface ChatMessageService {
    List<ChatMessage> getAllMessages();
    List<ChatMessage> getMessagesByRoomId(String roomId);
    ChatMessage sendMessage(ChatMessage message);
}
