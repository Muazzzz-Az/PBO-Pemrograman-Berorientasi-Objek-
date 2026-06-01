package org.example.config;

import com.corundumstudio.socketio.SocketIOServer;
import org.example.entity.ChatMessage;
import org.example.service.ChatMessageService;
import org.springframework.stereotype.Component;

@Component
public class SocketEventHandler {

    private final SocketIOServer server;
    private final ChatMessageService chatMessageService;

    public SocketEventHandler(SocketIOServer server, ChatMessageService chatMessageService) {
        this.server = server;
        this.chatMessageService = chatMessageService;

        // Listener ketika user masuk ke room chat
        this.server.addEventListener("join_chat", String.class, (client, roomId, ackSender) -> {
            client.joinRoom(roomId);
            System.out.println("✅ User " + client.getSessionId() + " masuk ke: " + roomId);
        });

        // Listener utama pengiriman pesan
        this.server.addEventListener("send_message", ChatMessage.class, (client, data, ackSender) -> {
            // 1. Simpan ke database MySQL via service
            chatMessageService.sendMessage(data);

            // 2. Kirim pesan ke semua orang yang ada di room tersebut
            this.server.getRoomOperations(data.getRoomId()).sendEvent("receive_message", data);

            System.out.println("📩 Pesan di " + data.getRoomId() + " dari " + data.getSenderName());
        });

        // Listener fitur typing (sedang mengetik)
        this.server.addEventListener("typing", Object.class, (client, data, ackSender) -> {
            // Forward status typing ke orang lain di room yang sama
            // Data biasanya berisi { roomId, isTyping, senderName }
            client.getNamespace().getBroadcastOperations().sendEvent("user_typing", data);
        });
    }
}