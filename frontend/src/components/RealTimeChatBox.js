import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/ChatService';
import {
  Box, TextField, Button, Typography, Paper, Avatar,
  Badge, CircularProgress, Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function RealTimeChatBox({ artistId, artistName, currentUser, commissionId }) {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Mengambil data artist untuk sinkronisasi ID
  const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const targetArtist = allUsers.find(u => u.username === artistName || u.fullName === artistName);

  const validArtistId = targetArtist?.id ? Number(targetArtist.id) : Number(artistId);
  const validCurrentUserId = Number(currentUser?.id);

  const roomId = (validCurrentUserId && validArtistId)
    ? `room_${Math.min(validCurrentUserId, validArtistId)}_${Math.max(validCurrentUserId, validArtistId)}`
    : null;

  useEffect(() => {
    if (!currentUser || !roomId) return;

    chatService.connect();
    chatService.joinRoom(roomId);

    const checkConnection = setInterval(() => {
      setIsConnected(chatService.isConnected);
    }, 1000);

    // Pastikan chatService.socket tersedia
        if (chatService.socket) {
          chatService.socket.on("user_online", (dataRoomId) => {
            if (dataRoomId === roomId) {
              console.log("Lawan bicara online!");
              setIsConnected(true); // Update status UI
            }
          });
        }

    const savedChat = JSON.parse(localStorage.getItem(`chat_${roomId}`) || '[]');
    setChatLog(savedChat);

    chatService.onMessage((data) => {
      if (data.roomId === roomId) {
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
      if (data.roomId === roomId) {
        setTypingUser(data.isTyping ? data.senderName : '');
      }
    });

    return () => {
          clearInterval(checkConnection);
          // PENTING: Bersihkan listener saat komponen di-unmount agar tidak double
          if (chatService.socket) {
            chatService.socket.off("user_online");
          }
          if (chatService.leaveRoom) {
            chatService.leaveRoom(roomId);
          }
        };
      }, [currentUser, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  useEffect(() => {
      if (roomId) {
          // Fetch ke Controller Java yang sudah kamu buat
          fetch(`http://localhost:8080/api/chat/room/${roomId}`)
              .then(res => res.json())
              .then(data => {
                  // Update chatLog dengan data dari MySQL
                  setChatLog(data);
                  // Simpan ke localStorage biar tidak perlu fetch terus-menerus
                  localStorage.setItem(`chat_${roomId}`, JSON.stringify(data));
              })
              .catch(err => console.error("Gagal tarik chat dari MySQL:", err));
      }
  }, [roomId]); // Akan jalan otomatis saat roomId terbentuk

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!isTyping && roomId && isConnected) {
      setIsTyping(true);
      chatService.sendTyping(roomId, true, currentUser?.fullName || currentUser?.username);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (isConnected) {
        chatService.sendTyping(roomId, false, currentUser?.fullName || currentUser?.username);
      }
    }, 1000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const tempMessage = {
      id: Date.now(),
      text: message,
      content: message,
      senderId: validCurrentUserId,
      senderName: currentUser.fullName || currentUser.username,
      receiverId: validArtistId,
      roomId: roomId,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // 1. Update UI & Local Storage segera agar user tidak menunggu
    const newChatLog = [...chatLog, tempMessage];
    setChatLog(newChatLog);
    localStorage.setItem(`chat_${roomId}`, JSON.stringify(newChatLog));
    setMessage('');

    // 2. Kirim via Socket jika terhubung
    if (isConnected) {
      chatService.sendMessage(tempMessage);
    }

    // 3. Fallback: Simpan ke Database via REST API agar pesan tersimpan permanen
    try {
      await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempMessage)
      });
    } catch (err) {
      console.error("Gagal menyimpan pesan ke database:", err);
    }
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
    <Paper sx={{ borderRadius: '20px', overflow: 'hidden', height: '500px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
      <Box sx={{ p: 2, bgcolor: '#4A9FBF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#FFFFFF', color: '#4A9FBF', fontWeight: 'bold' }}>{artistName?.charAt(0)}</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{artistName}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Badge color={isConnected ? "success" : "warning"} variant="dot" />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {isConnected ? 'Live' : 'Offline Mode (Saved to DB)'}
              </Typography>
            </Box>
          </Box>
        </Box>
        {!isConnected && <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />}
      </Box>


      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#F8FAFC' }}>
        {chatLog.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="body2" color="text.secondary">No messages yet</Typography>
            <Typography variant="caption" color="text.secondary">Start the conversation with {artistName}!</Typography>
          </Box>
        ) : (
          chatLog.map((msg, idx) => {
            const isMe = Number(msg.senderId) === validCurrentUserId;
            return (
              <Box key={msg.id || idx} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                <Box sx={{
                  maxWidth: '75%',
                  bgcolor: isMe ? '#4A9FBF' : '#FFFFFF',
                  color: isMe ? '#FFFFFF' : '#1C2833',
                  p: 1.5,
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold', opacity: 0.8 }}>
                    {isMe ? 'You' : msg.senderName}
                  </Typography>
                  <Typography variant="body2">{msg.text || msg.content}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right', fontSize: '0.65rem', opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
        {typingUser && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#64748B' }}>{typingUser} is typing...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: '#FFFFFF', display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px', bgcolor: '#F8FAFC' } }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!message.trim()}
          sx={{ bgcolor: '#4A9FBF', borderRadius: '40px', minWidth: 'auto', px: 3, '&:hover': { bgcolor: '#388EAC' } }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
}

export default RealTimeChatBox;