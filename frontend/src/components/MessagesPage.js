// src/components/MessagesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, Card, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider, TextField, Badge, InputAdornment, Paper, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RealTimeChatBox from './RealTimeChatBox';
import userService from '../services/userService';

// Fungsi untuk mark as read
const markMessagesAsRead = (roomId, currentUserId) => {
  const key = `chat_${roomId}`;
  const messages = JSON.parse(localStorage.getItem(key) || '[]');
  let updated = false;

  const newMessages = messages.map(msg => {
    if (msg.receiverId === currentUserId && !msg.isRead) {
      updated = true;
      return { ...msg, isRead: true };
    }
    return msg;
  });

  if (updated) {
    localStorage.setItem(key, JSON.stringify(newMessages));
    window.dispatchEvent(new Event('storage'));
  }
};

function MessagesPage({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const currentUser = user || JSON.parse(localStorage.getItem('user'));

  const queryParams = new URLSearchParams(location.search);
  const targetUserId = queryParams.get('userId');
  const productId = queryParams.get('productId');
  const productTitle = queryParams.get('productTitle');
  const productPrice = queryParams.get('productPrice');

  // Hitung unread count
  const getUnreadCount = (roomId) => {
    const key = `chat_${roomId}`;
    const messages = JSON.parse(localStorage.getItem(key) || '[]');
    return messages.filter(m => m.receiverId === currentUser?.id && !m.isRead).length;
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // HANYA SATU FUNGSI fetchConversations
    const fetchConversations = () => {
      const allMessages = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('chat_')) {
          const messages = JSON.parse(localStorage.getItem(key) || '[]');
          allMessages.push(...messages);
        }
      }

      const chatRooms = new Map();
      const allUsers = userService.getAllRegisteredUsers();

      const myMessages = allMessages.filter(m =>
        Number(m.senderId) === currentUser.id || Number(m.receiverId) === currentUser.id
      );

      myMessages.forEach(msg => {
        const roomKey = msg.roomId;
        if (!roomKey) return;

        const ids = roomKey.replace('room_', '').split('_');
        const user1 = parseInt(ids[0]);
        const user2 = parseInt(ids[1]);
        const otherId = (user1 === currentUser.id) ? user2 : user1;

        // CARI NAMA DARI DATABASE
        const otherUser = allUsers.find(u => u.id === otherId);
        let otherName = otherUser?.fullName || otherUser?.username;

        // Jika masih tidak ada, gunakan nama dari pesan
        if (!otherName) {
          const msgFromOther = myMessages.find(m => m.senderId === otherId);
          otherName = msgFromOther?.senderName || `User ${otherId}`;
        }

        const otherAvatar = otherUser?.avatarUrl || null;

        if (!chatRooms.has(roomKey) || new Date(msg.timestamp) > new Date(chatRooms.get(roomKey).lastMessage.timestamp)) {
          const unreadCount = myMessages.filter(m => m.roomId === roomKey && m.receiverId === currentUser.id && !m.isRead).length;

          chatRooms.set(roomKey, {
            roomKey: roomKey,
            otherId: otherId,
            otherName: otherName,
            otherAvatar: otherAvatar,
            lastMessage: msg,
            unreadCount: unreadCount
          });
        }
      });

      const sortedConversations = Array.from(chatRooms.values()).sort(
        (a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
      );

      setConversations(sortedConversations);
    };

    fetchConversations();

    const intervalId = setInterval(fetchConversations, 2000);

    if (targetUserId && !selectedChat) {
      const targetId = parseInt(targetUserId);
      const allUsers = userService.getAllRegisteredUsers();
      const targetUser = allUsers.find(u => u.id === targetId);
      const targetName = targetUser?.fullName || targetUser?.username || `Artist ${targetId}`;

      const roomKey = `room_${Math.min(currentUser.id, targetId)}_${Math.max(currentUser.id, targetId)}`;

      markMessagesAsRead(roomKey, currentUser.id);

      setSelectedChat({
        roomKey: roomKey,
        otherId: targetId,
        otherName: targetName,
        otherAvatar: targetUser?.avatarUrl
      });
    }

    return () => clearInterval(intervalId);
  }, [currentUser, navigate, targetUserId, selectedChat]);

  const handleSelectChat = (conv) => {
    markMessagesAsRead(conv.roomKey, currentUser.id);
    setSelectedChat(conv);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    window.dispatchEvent(new Event('storage'));
  };

  const filtered = conversations.filter(c =>
    c.otherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Halaman Chat
  if (selectedChat) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
        <Container maxWidth="md">
          <Button
            onClick={handleBackToList}
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 2,
              color: '#4A9FBF',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(74, 159, 191, 0.05)' }
            }}
          >
            ← Back to conversations
          </Button>
          <RealTimeChatBox
            artistId={selectedChat.otherId}
            artistName={selectedChat.otherName}
            currentUser={currentUser}
            commissionId={productId}
            productTitle={productTitle}
            productPrice={productPrice}
            onMessageRead={() => {
              markMessagesAsRead(selectedChat.roomKey, currentUser.id);
            }}
          />
        </Container>
      </Box>
    );
  }

  // Halaman Daftar Chat
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 4 }}>
          💬 Messages
        </Typography>

        <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0' }}>
            <TextField
              fullWidth
              placeholder="Search conversations..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
              }}
            />
          </Box>

          <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
                <Typography variant="body2" color="text.secondary">No conversations yet</Typography>
                <Typography variant="caption" color="text.secondary">
                  Start by expressing interest in a product from the Shop!
                </Typography>
              </Box>
            ) : (
              filtered.map((conv, idx) => {
                const unreadCount = getUnreadCount(conv.roomKey);
                return (
                  <React.Fragment key={conv.roomKey}>
                    <ListItem
                      button
                      onClick={() => handleSelectChat(conv)}
                      sx={{
                        '&:hover': { bgcolor: '#F0F9FF' },
                        bgcolor: unreadCount > 0 ? 'rgba(74, 159, 191, 0.05)' : 'transparent'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={conv.otherAvatar} sx={{ bgcolor: '#4A9FBF' }}>
                          {conv.otherName?.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography fontWeight={unreadCount > 0 ? 700 : 500}>
                              {conv.otherName}
                            </Typography>
                            {unreadCount > 0 && (
                              <Badge
                                badgeContent={unreadCount}
                                color="error"
                                sx={{
                                  '& .MuiBadge-badge': {
                                    fontSize: '0.7rem',
                                    height: 18,
                                    minWidth: 18
                                  }
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {conv.lastMessage?.text?.substring(0, 50) || conv.lastMessage?.content?.substring(0, 50)}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {idx < filtered.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })
            )}
          </List>
        </Card>
      </Container>
    </Box>
  );
}

export default MessagesPage;