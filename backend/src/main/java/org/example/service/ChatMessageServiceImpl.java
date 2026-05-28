package org.example.service;
import org.example.entity.ChatMessage;
import org.example.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public List<ChatMessage> getAllMessages() {
        return chatMessageRepository.findAll(); // Mengambil semua riwayat chat
    }

    @Override
    public ChatMessage sendMessage(ChatMessage message) {
        return chatMessageRepository.save(message); // Menyimpan chat baru
    }
}