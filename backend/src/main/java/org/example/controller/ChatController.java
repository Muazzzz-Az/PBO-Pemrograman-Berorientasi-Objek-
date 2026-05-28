package org.example.controller;
import org.example.entity.ChatMessage;
import org.example.service.ChatMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000") // Izin akses dari React
public class ChatController {

    private final ChatMessageService chatMessageService;

    public ChatController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    // Endpoint mengambil riwayat pesan
    @GetMapping
    public ResponseEntity<List<ChatMessage>> getMessages() {
        return ResponseEntity.ok(chatMessageService.getAllMessages());
    }

    // Endpoint mengirim pesan baru
    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(@Valid @RequestBody ChatMessage message) {
        return ResponseEntity.ok(chatMessageService.sendMessage(message));
    }
}