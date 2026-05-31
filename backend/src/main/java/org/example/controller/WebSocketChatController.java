package org.example.controller;

import org.example.entity.ChatMessage;
import org.example.service.ChatMessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {

    private final ChatMessageService chatMessageService;

    public WebSocketChatController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    // Menerima pesan dari frontend: /app/chat/{artistId}/{userId}
    // Meneruskan ke semua subscriber: /topic/messages/{artistId}/{userId}
    @MessageMapping("/chat/{artistId}/{userId}")
    @SendTo("/topic/messages/{artistId}/{userId}")
    public ChatMessage handleMessage(
            @DestinationVariable String artistId,
            @DestinationVariable String userId,
            ChatMessage message) {

        // Set roomId otomatis
        message.setRoomId("room_" + userId + "_" + artistId);

        // Simpan ke database
        return chatMessageService.sendMessage(message);
    }
}
