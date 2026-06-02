// src/services/ChatService.js
import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this._messageListeners = [];
    this._typingListeners = [];
    this.reconnectAttempts = 0;
  }

  connect() {
    if (this.socket && this.socket.connected) {
      console.log('Already connected');
      return;
    }

    console.log('Connecting to chat server on port 8085...');

    this.socket = io('http://localhost:8085', {
      transports: ['websocket', 'polling'], // polling sebagai fallback
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to Chat Server (Port 8085)');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      this.isConnected = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
    });
  }

  joinRoom(roomId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_chat', roomId);
      console.log(`Joined room: ${roomId}`);
    } else {
      console.log('Cannot join room: not connected');
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
    } else {
      console.log('Cannot send message: not connected');
    }
  }

  onMessage(callback) {
    this._messageListeners.push(callback);
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onTyping(callback) {
    this._typingListeners.push(callback);
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const chatService = new ChatService();