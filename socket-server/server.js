// D:\Project sem 4\socket-server\server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // User joins with their userId
  socket.on('user_online', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} is online`);
    io.emit('users_online', Array.from(onlineUsers.keys()));
  });

  // Join a specific chat room
  socket.on('join_chat', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Leave chat room
  socket.on('leave_chat', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });

  // Send message to room
  socket.on('send_message', (data) => {
    const { roomId, message, senderId, senderName, receiverId } = data;

    const messageData = {
      id: Date.now(),
      text: message,
      senderId: senderId,
      senderName: senderName,
      receiverId: receiverId,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    io.to(roomId).emit('receive_message', messageData);

    // Notify receiver if online
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('new_message_notification', {
        from: senderName,
        roomId: roomId
      });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { roomId, isTyping, senderName } = data;
    socket.to(roomId).emit('user_typing', { isTyping, senderName });
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('users_online', Array.from(onlineUsers.keys()));
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});