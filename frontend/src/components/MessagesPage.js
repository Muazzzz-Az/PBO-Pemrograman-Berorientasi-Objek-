// src/components/MessagesPage.js - FULLY FIXED
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, Card, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider, TextField, IconButton, Badge, InputAdornment, Paper, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RealTimeChatBox from './RealTimeChatBox';

function MessagesPage({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const currentUser = user || JSON.parse(localStorage.getItem('user'));

  // Ambil parameter dari URL (jika dari klik product)
  const queryParams = new URLSearchParams(location.search);
  const targetUserId = queryParams.get('userId');
  const productId = queryParams.get('productId');
  const productTitle = queryParams.get('productTitle');
  const productPrice = queryParams.get('productPrice');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadConversations = () => {
      const chatRooms = new Map();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('chat_')) {
          const chatData = JSON.parse(localStorage.getItem(key));
          if (chatData && chatData.length > 0) {
            // Extract other user ID from room key
            const roomParts = key.replace('chat_', '').split('_');
            const otherId = roomParts.find(p => parseInt(p) !== currentUser.id);

            if (otherId && !isNaN(parseInt(otherId))) {
              // Cari nama user dari localStorage
              const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
              const otherUser = allUsers.find(u => u.id === parseInt(otherId));
              const otherName = otherUser?.fullName || otherUser?.username || `User ${otherId}`;

              chatRooms.set(key, {
                roomKey: key,
                otherId: parseInt(otherId),
                otherName: otherName,
                lastMessage: chatData[chatData.length - 1],
                unreadCount: chatData.filter(m => !m.isRead && m.receiverId === currentUser.id).length
              });
            }
          }
        }
      }

      setConversations(Array.from(chatRooms.values()));
    };

    loadConversations();

    // Auto-select chat jika ada targetUserId dari URL
    if (targetUserId && !selectedChat) {
      const targetId = parseInt(targetUserId);
      const roomKey = `chat_${Math.min(currentUser.id, targetId)}_${Math.max(currentUser.id, targetId)}`;
      setSelectedChat({
        roomKey: roomKey,
        otherId: targetId,
        otherName: `Artist ${targetId}`
      });
    }
  }, [currentUser, navigate, targetUserId, selectedChat]);

  const filtered = conversations.filter(c =>
    c.otherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Jika ada selectedChat, tampilkan chat box
  if (selectedChat) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
        <Container maxWidth="md">
          <Button
            onClick={() => setSelectedChat(null)}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2, color: '#4A9FBF', textTransform: 'none' }}
          >
            Back to conversations
          </Button>
          <RealTimeChatBox
            artistId={selectedChat.otherId}
            artistName={selectedChat.otherName}
            currentUser={currentUser}
            commissionId={productId}
            productTitle={productTitle}
            productPrice={productPrice}
          />
        </Container>
      </Box>
    );
  }

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
              filtered.map((conv, idx) => (
                <React.Fragment key={conv.roomKey}>
                  <ListItem
                    button
                    onClick={() => setSelectedChat(conv)}
                    sx={{ '&:hover': { bgcolor: '#F0F9FF' } }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#4A9FBF' }}>
                        {conv.otherName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography fontWeight={conv.unreadCount > 0 ? 700 : 500}>
                            {conv.otherName}
                          </Typography>
                          {conv.unreadCount > 0 && (
                            <Badge badgeContent={conv.unreadCount} color="error" />
                          )}
                        </Box>
                      }
                      secondary={conv.lastMessage?.text?.substring(0, 50)}
                    />
                  </ListItem>
                  {idx < filtered.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Card>
      </Container>
    </Box>
  );
}

export default MessagesPage;