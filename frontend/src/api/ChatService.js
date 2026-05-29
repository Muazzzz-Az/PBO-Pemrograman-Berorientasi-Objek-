import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default class ChatService {
    constructor(artistId, userId) {
        this.artistId = artistId;
        this.userId = userId;
        this.client = null;
    }

    connect(onMessageReceived) {
        const socket = new SockJS('http://localhost:8080/ws');
        this.client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to Chat WebSocket");
                // Berlangganan ke channel chat artist & user spesifik
                this.client.subscribe(`/topic/messages/${this.artistId}/${this.userId}`, (msg) => {
                    onMessageReceived(JSON.parse(msg.body));
                });
            }
        });
        this.client.activate();
    }

    sendMessage(content) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: `/app/chat/${this.artistId}/${this.userId}`,
                body: JSON.stringify({ senderId: this.userId, content })
            });
        }
    }

    disconnect() {
        if (this.client) this.client.deactivate();
    }
}