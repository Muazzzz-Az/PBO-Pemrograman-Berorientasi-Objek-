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

        this.server.addConnectListener(client -> {
            System.out.println("🔗 Client Terhubung: " + client.getSessionId());
        });

        this.server.addDisconnectListener(client -> {
            System.out.println("❌ Client Terputus: " + client.getSessionId());
        });

        // Listener ketika user masuk ke room chat
        this.server.addEventListener("join_chat", String.class, (client, roomId, ackSender) -> {
            client.joinRoom(roomId);
            // Kirim sinyal ke SEMUA orang di room itu bahwa seseorang baru saja online
            this.server.getRoomOperations(roomId).sendEvent("user_online", roomId);
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