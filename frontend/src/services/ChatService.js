// src/services/ChatService.js
import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this._messageListeners = [];
    this._typingListeners = [];
  }

  connect() {
    if (this.socket) return;

    // WAJIB PORT 8085 agar menyambung ke mesin SocketIO di Java
    this.socket = io('http://localhost:8085', {
      transports: ['websocket'],
      upgrade: false,
      reconnection: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Berhasil terhubung ke Server Chat (Port 8085)');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Koneksi Chat terputus');
      this.isConnected = false;
    });

    // Mendengarkan pesan masuk dari server
    this.socket.on('receive_message', (data) => {
      this._messageListeners.forEach(fn => fn(data));
    });

    // Mendengarkan status mengetik
    this.socket.on('user_typing', (data) => {
      this._typingListeners.forEach(fn => fn(data));
    });
  }

  joinRoom(roomId) {
      if (this.socket && this.socket.connected) {
        this.socket.emit('join_chat', roomId);
      }
   }

  leaveRoom(roomId) {
    if (this.socket && this.socket.connected) {
        this.socket.emit('leave_chat', roomId);
    }
  }

  sendTyping(roomId, isTyping, senderName) {
    if (this.socket && this.socket.connected) {
        this.socket.emit('typing', { roomId, isTyping, senderName });
    }
  }

  sendMessage(messageData) {
      if (this.socket && this.socket.connected) {
        this.socket.emit('send_message', messageData);
      }
  }

  onMessage(callback) {
    this._messageListeners.push(callback);
  }

  onTyping(callback) {
    this._typingListeners.push(callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatService = new ChatService();