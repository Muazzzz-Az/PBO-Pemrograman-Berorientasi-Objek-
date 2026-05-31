// D:\Project sem 4\frontend\src\components\MessagesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Card, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider, TextField, IconButton, Badge, InputAdornment, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';

function MessagesPage({ user }) {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = user || JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadConversations = () => {
      const chatRooms = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('chat_')) {
          const chatData = JSON.parse(localStorage.getItem(key));
          if (chatData?.length > 0) {
            const firstMsg = chatData[0];
            const otherId = firstMsg.senderId === currentUser.id ? firstMsg.receiverId : firstMsg.senderId;
            const otherName = firstMsg.senderId === currentUser.id ?
              chatData.find(m => m.senderId !== currentUser.id)?.senderName :
              firstMsg.senderName;

            chatRooms.push({
              roomKey: key,
              otherId: otherId,
              otherName: otherName || `User ${otherId}`,
              lastMessage: chatData[chatData.length - 1],
              unreadCount: chatData.filter(m => !m.isRead && m.receiverId === currentUser.id).length
            });
          }
        }
      }
      setConversations(chatRooms);
    };

    loadConversations();
  }, [currentUser, navigate]);

  const filtered = conversations.filter(c => c.otherName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 4 }}>💬 Messages</Typography>
        <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0' }}>
            <TextField fullWidth placeholder="Search..." size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          </Box>
          <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
                <Typography variant="body2" color="text.secondary">No conversations</Typography>
              </Box>
            ) : (
              filtered.map((conv) => (
                <React.Fragment key={conv.roomKey}>
                  <ListItem button onClick={() => navigate(`/artists/${conv.otherId}`)}>
                    <ListItemAvatar><Avatar sx={{ bgcolor: '#4A9FBF' }}>{conv.otherName.charAt(0)}</Avatar></ListItemAvatar>
                    <ListItemText primary={<Box display="flex" justifyContent="space-between"><Typography fontWeight={conv.unreadCount > 0 ? 700 : 500}>{conv.otherName}</Typography>{conv.unreadCount > 0 && <Badge badgeContent={conv.unreadCount} color="error" />}</Box>} secondary={conv.lastMessage?.text} />
                  </ListItem>
                  <Divider />
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