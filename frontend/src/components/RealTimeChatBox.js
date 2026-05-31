// src/components/RealTimeChatBox.js - FIXED
import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/ChatService';
import {
  Box, TextField, Button, Typography, Paper, Avatar,
  IconButton, Badge, CircularProgress, Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function RealTimeChatBox({ artistId, artistName, currentUser, commissionId }) {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // <-- ADD THIS
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const roomId = `room_${Math.min(currentUser?.id, artistId)}_${Math.max(currentUser?.id, artistId)}`;

  useEffect(() => {
    if (!currentUser) return;

    chatService.connect();
    chatService.joinRoom(roomId);

    // Set connected status
    const checkConnection = setInterval(() => {
      setIsConnected(chatService.isConnected);
    }, 1000);

    const savedChat = JSON.parse(localStorage.getItem(`chat_${roomId}`) || '[]');
    setChatLog(savedChat);

    chatService.onMessage((data) => {
      if (data.roomId === roomId || !data.roomId) {
        setChatLog(prev => {
          const exists = prev.some(msg => msg.id === data.id);
          if (exists) return prev;
          const newLog = [...prev, data];
          localStorage.setItem(`chat_${roomId}`, JSON.stringify(newLog));
          return newLog;
        });
      }
    });

    chatService.onTyping((data) => {
      setTypingUser(data.isTyping ? data.senderName : '');
    });

    chatService.onOnlineStatus((users) => {
      setOnlineStatus(users.includes(artistId));
    });

    return () => {
      clearInterval(checkConnection);
      chatService.leaveRoom(roomId);
    };
  }, [currentUser, artistId, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      chatService.sendTyping(roomId, true, currentUser?.fullName);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      chatService.sendTyping(roomId, false, currentUser?.fullName);
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const tempMessage = {
      id: Date.now(),
      text: message,
      senderId: currentUser.id,
      senderName: currentUser.fullName || currentUser.username,
      receiverId: artistId,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    chatService.sendMessage(roomId, message, currentUser.id, tempMessage.senderName, artistId);
    setChatLog(prev => [...prev, tempMessage]);
    localStorage.setItem(`chat_${roomId}`, JSON.stringify([...chatLog, tempMessage]));
    setMessage('');
    setIsTyping(false);
    chatService.sendTyping(roomId, false, currentUser?.fullName);
  };

  if (!currentUser) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '20px', bgcolor: '#FCE4EC' }}>
        <Typography variant="body1" color="#C2185B" sx={{ fontWeight: 600 }}>🔒 Login to Chat</Typography>
        <Typography variant="caption" color="text.secondary">Please login to discuss commission details</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: '20px', overflow: 'hidden', height: '500px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, bgcolor: '#4A9FBF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#FFFFFF', color: '#4A9FBF' }}>{artistName?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{artistName}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Badge color={onlineStatus ? "success" : "error"} variant="dot" />
              <Typography variant="caption">{onlineStatus ? 'Online' : 'Offline'}</Typography>
            </Box>
          </Box>
        </Box>
        {!isConnected && <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#F8FAFC' }}>
        {chatLog.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="body2" color="text.secondary">No messages yet</Typography>
            <Typography variant="caption" color="text.secondary">Start the conversation!</Typography>
          </Box>
        ) : (
          chatLog.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <Box key={msg.id || idx} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                <Box sx={{ maxWidth: '75%', bgcolor: isMe ? '#4A9FBF' : '#FFFFFF', color: isMe ? '#FFFFFF' : '#1C2833', p: 1.5, borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px' }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>{msg.senderName}</Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        {typingUser && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box sx={{ bgcolor: '#E2E8F0', p: 1, borderRadius: '16px' }}>
              <Typography variant="caption">{typingUser} is typing...</Typography>
            </Box>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: '#FFFFFF', display: 'flex', gap: 1 }}>
        <TextField fullWidth size="small" placeholder="Type a message..." value={message} onChange={handleTyping} disabled={!isConnected} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px', bgcolor: '#F8FAFC' } }} />
        <Button type="submit" variant="contained" disabled={!message.trim() || !isConnected} sx={{ bgcolor: '#4A9FBF', borderRadius: '40px', minWidth: 'auto', px: 3 }}><SendIcon /></Button>
      </Box>
    </Paper>
  );
}

export default RealTimeChatBox;