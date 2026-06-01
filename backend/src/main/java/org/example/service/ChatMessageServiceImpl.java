package org.example.service;

import org.example.entity.ChatMessage;
import org.example.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public List<ChatMessage> getAllMessages() {
        return chatMessageRepository.findAll();
    }

    @Override
    public List<ChatMessage> getMessagesByRoomId(String roomId) {
        return chatMessageRepository.findByRoomIdOrderByIdAsc(roomId);
    }

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        // Auto-fill Timestamp jika kosong
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
        }

        // Sinkronisasi data antara 'content' dan 'text' untuk frontend
        if (message.getContent() == null && message.getText() != null) {
            message.setContent(message.getText());
        }
        if (message.getText() == null && message.getContent() != null) {
            message.setText(message.getContent());
        }

        // Backup untuk field sender
        if (message.getSender() == null && message.getSenderName() != null) {
            message.setSender(message.getSenderName());
        }

        return chatMessageRepository.save(message);
    }
}