// src/services/ChatService.js
import io from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this._messageListeners = [];
    this._typingListeners = [];
    this._onlineListeners = [];
  }

  connect() {
    if (this.socket) return;

    this.socket = io('http://localhost:8080', {
      transports: ['websocket'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Chat service connected');
      this.isConnected = true;
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.socket.emit('user_online', user.id);
      }
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('receive_message', (data) => {
      this._messageListeners.forEach(fn => fn(data));
    });

    this.socket.on('user_typing', (data) => {
      this._typingListeners.forEach(fn => fn(data));
    });

    this.socket.on('users_online', (users) => {
      this._onlineListeners.forEach(fn => fn(users));
    });
  }

  joinRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_chat', roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_chat', roomId);
    }
  }

  sendMessage(roomId, message, senderId, senderName, receiverId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', {
        roomId, message, senderId, senderName, receiverId
      });
    }
  }

  sendTyping(roomId, isTyping, senderName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { roomId, isTyping, senderName });
    }
  }

  onMessage(callback) {
    this._messageListeners.push(callback);
  }

  onTyping(callback) {
    this._typingListeners.push(callback);
  }

  onOnlineStatus(callback) {
    this._onlineListeners.push(callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const chatService = new ChatService();