import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, Card, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider, TextField, Badge, InputAdornment, Paper, Button, Grid
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
    if (Number(msg.receiverId) === Number(currentUserId) && !msg.isRead) {
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
    return messages.filter(m => Number(m.receiverId) === Number(currentUser?.id) && !m.isRead).length;
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
        Number(m.senderId) === Number(currentUser.id) || Number(m.receiverId) === Number(currentUser.id)
      );

      myMessages.forEach(msg => {
        const roomKey = msg.roomId;
        if (!roomKey) return;

        const ids = roomKey.replace('room_', '').split('_');
        const user1 = parseInt(ids[0]);
        const user2 = parseInt(ids[1]);
        const otherId = (user1 === Number(currentUser.id)) ? user2 : user1;

        // CARI NAMA DARI DATABASE
        const otherUser = allUsers.find(u => u.id === otherId);
        let otherName = otherUser?.fullName || otherUser?.username;

        // Jika masih tidak ada, gunakan nama dari pesan
        if (!otherName) {
          const msgFromOther = myMessages.find(m => Number(m.senderId) === Number(otherId));
          otherName = msgFromOther?.senderName || `User ${otherId}`;
        }

        const otherAvatar = otherUser?.avatarUrl || null;

        if (!chatRooms.has(roomKey) || new Date(msg.timestamp) > new Date(chatRooms.get(roomKey).lastMessage.timestamp)) {
          const unreadCount = myMessages.filter(m => m.roomId === roomKey && Number(m.receiverId) === Number(currentUser.id) && !m.isRead).length;

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

      const roomKey = `room_${Math.min(Number(currentUser.id), targetId)}_${Math.max(Number(currentUser.id), targetId)}`;

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
    navigate('/messages');
    window.dispatchEvent(new Event('storage'));
  };

  const filtered = conversations.filter(c =>
    c.otherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: { xs: 2, md: 5 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A6B8A', mb: 4, letterSpacing: '-0.5px' }}>
          💬 Messages
        </Typography>

        <Grid container spacing={3} sx={{ height: '600px' }}>
          {/* LEFT SIDEBAR: List of Conversations */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: { xs: selectedChat ? 'none' : 'block', md: 'block' },
              height: '100%'
            }}
          >
            <Card sx={{
              borderRadius: '20px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(74, 159, 191, 0.08)',
              border: '1px solid rgba(74, 159, 191, 0.12)'
            }}>
              {/* Search bar */}
              <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <TextField
                  fullWidth
                  placeholder="Search conversations..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#4A9FBF' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '30px',
                      bgcolor: '#F8FAFC',
                      '& fieldset': { borderColor: '#E2E8F0' },
                      '&:hover fieldset': { borderColor: '#4A9FBF' },
                      '&.Mui-focused fieldset': { borderColor: '#1A6B8A' }
                    }
                  }}
                />
              </Box>

              {/* Conversations List */}
              <List sx={{
                flex: 1,
                overflowY: 'auto',
                bgcolor: '#FFFFFF',
                py: 0,
                // Custom thin scrollbar
                '&::-webkit-scrollbar': { width: '5px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: '10px' },
                '&::-webkit-scrollbar-thumb:hover': { background: '#94A3B8' }
              }}>
                {filtered.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                    <ChatIcon sx={{ fontSize: 44, color: '#CBD5E1' }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>No conversations yet</Typography>
                    <Typography variant="caption" color="text.secondary" align="center" sx={{ px: 2 }}>
                      Start by expressing interest in a product from the Shop!
                    </Typography>
                  </Box>
                ) : (
                  filtered.map((conv, idx) => {
                    const unreadCount = getUnreadCount(conv.roomKey);
                    const isSelected = selectedChat?.roomKey === conv.roomKey;
                    return (
                      <React.Fragment key={conv.roomKey}>
                        <ListItem
                          button
                          onClick={() => handleSelectChat(conv)}
                          sx={{
                            py: 1.8,
                            px: 2.5,
                            transition: 'all 0.2s ease',
                            borderLeft: isSelected ? '4px solid #4A9FBF' : '4px solid transparent',
                            bgcolor: isSelected 
                              ? 'rgba(74, 159, 191, 0.08)' 
                              : (unreadCount > 0 ? 'rgba(74, 159, 191, 0.03)' : 'transparent'),
                            '&:hover': {
                              bgcolor: isSelected ? 'rgba(74, 159, 191, 0.12)' : '#F8FAFC',
                              paddingLeft: isSelected ? '20px' : '22px'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={conv.otherAvatar} sx={{
                              bgcolor: '#4A9FBF',
                              boxShadow: '0 2px 8px rgba(74, 159, 191, 0.15)',
                              border: isSelected ? '2px solid #FFFFFF' : 'none'
                            }}>
                              {conv.otherName?.charAt(0).toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography sx={{
                                  fontWeight: unreadCount > 0 || isSelected ? 700 : 500,
                                  color: isSelected ? '#1A6B8A' : '#1C2833',
                                  fontSize: '0.92rem'
                                }}>
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
                                        minWidth: 18,
                                        fontWeight: 700
                                      }
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography 
                                variant="caption" 
                                color={isSelected ? '#4A9FBF' : 'text.secondary'} 
                                noWrap 
                                sx={{ display: 'block', mt: 0.3, fontWeight: unreadCount > 0 ? 600 : 400 }}
                              >
                                {conv.lastMessage?.text || conv.lastMessage?.content || ''}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {idx < filtered.length - 1 && <Divider sx={{ opacity: 0.6 }} />}
                      </React.Fragment>
                    );
                  })
                )}
              </List>
            </Card>
          </Grid>

          {/* RIGHT PANE: Chat box viewport */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: { xs: selectedChat ? 'block' : 'none', md: 'block' },
              height: '100%'
            }}
          >
            {selectedChat ? (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Back button (only visible on mobile screens) */}
                <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1.5 }}>
                  <Button
                    onClick={handleBackToList}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      color: '#4A9FBF',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: '20px',
                      '&:hover': { bgcolor: 'rgba(74, 159, 191, 0.08)' }
                    }}
                  >
                    ← Back to conversations
                  </Button>
                </Box>
                
                <Box sx={{ flex: 1, minHeight: 0 }}>
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
                    height="100%"
                  />
                </Box>
              </Box>
            ) : (
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4,
                borderRadius: '20px',
                border: '1.5px dashed rgba(74, 159, 191, 0.25)',
                bgcolor: '#FFFFFF',
                boxShadow: 'none'
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4A9FBF',
                  mb: 2.5,
                  boxShadow: '0 4px 12px rgba(74, 159, 191, 0.1)'
                }}>
                  <ChatIcon sx={{ fontSize: 36 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#1A6B8A" gutterBottom>
                  Select a Conversation
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.6 }}>
                  Choose a chat from the sidebar list to discuss commission details, terms, and progress with your artist or buyer.
                </Typography>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default MessagesPage;