package org.example.controller;

import org.example.entity.ChatMessage;
import org.example.service.ChatMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000") // Pastikan port React sesuai
public class ChatController {

    private final ChatMessageService chatMessageService;

    // Dependency Injection
    public ChatController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @GetMapping
    public ResponseEntity<List<ChatMessage>> getMessages() {
        return ResponseEntity.ok(chatMessageService.getAllMessages());
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ChatMessage>> getMessagesByRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(chatMessageService.getMessagesByRoomId(roomId));
    }

    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        return ResponseEntity.ok(chatMessageService.sendMessage(message));
    }
}