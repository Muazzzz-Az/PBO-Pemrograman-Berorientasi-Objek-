package org.example.service;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Service
public class SocketService {

    private final SocketIOServer server;

    public SocketService(SocketIOServer server) {
        this.server = server;
    }

    @PostConstruct
    public void startServer() {
        // Event saat user join room
        server.addEventListener("join_room", String.class, (client, roomId, ackSender) -> {
            client.joinRoom(roomId);
            System.out.println("User joined room: " + roomId);
        });

        // Event saat ada pesan masuk (send_message)
        server.addEventListener("send_message", Object.class, (client, data, ackSender) -> {
            // Kirim balik ke semua orang di room yang sama (termasuk artist)
            server.getBroadcastOperations().sendEvent("receive_message", data);
        });

        server.start();
    }

    @PreDestroy
    public void stopServer() {
        server.stop();
    }
}