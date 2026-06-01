// src/components/MessagesPage.js
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

    const fetchConversations = async () => {
      try {
        // FIX 1: Tarik semua chat dari Database, BUKAN dari localStorage
        const res = await fetch('http://localhost:8080/api/chat');
        if (!res.ok) throw new Error("Gagal mengambil data dari server");
        const allMessages = await res.json();

        const chatRooms = new Map();
        const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

        // Filter pesan yang HANYA melibatkan user yang sedang login
        const myMessages = allMessages.filter(m =>
          Number(m.senderId) === currentUser.id || Number(m.receiverId) === currentUser.id
        );

        // Grouping berdasarkan roomId
        myMessages.forEach(msg => {
          const roomKey = msg.roomId; // Format: room_1_2
          // Ekstrak ID dari string room_1_2 yang valid
          const ids = roomKey.replace('room_', '').split('_');
          const user1 = parseInt(ids[0]);
          const user2 = parseInt(ids[1]);

          // Cari tahu mana ID lawan bicara (bukan ID kita sendiri)
          const otherId = (user1 === currentUser.id) ? user2 : user1;

          if (!chatRooms.has(roomKey) || new Date(msg.timestamp) > new Date(chatRooms.get(roomKey).lastMessage.timestamp)) {
            // Cari nama lawan bicara untuk ditampilkan di inbox
            const otherUser = allUsers.find(u => u.id === otherId);
            const otherName = otherUser?.fullName || otherUser?.username || `User ${otherId}`;

            // Hitung unread (pesan di mana kita adalah receiver dan belum dibaca)
            const unreadCount = myMessages.filter(m => m.roomId === roomKey && m.receiverId === currentUser.id && !m.isRead).length;

            chatRooms.set(roomKey, {
              roomKey: roomKey,
              otherId: otherId,
              otherName: otherName,
              lastMessage: msg,
              unreadCount: unreadCount
            });
          }
        });

        // Urutkan dari chat terbaru ke terlama
        const sortedConversations = Array.from(chatRooms.values()).sort(
          (a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
        );

        setConversations(sortedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
    
    // Polling ringan tiap 3 detik agar inbox terupdate otomatis
    const intervalId = setInterval(fetchConversations, 3000);

    // Auto-select chat jika ada targetUserId dari URL
    if (targetUserId && !selectedChat) {
      const targetId = parseInt(targetUserId);
      const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const targetUser = allUsers.find(u => u.id === targetId);
      const targetName = targetUser?.fullName || targetUser?.username || `Artist ${targetId}`;

      const roomKey = `room_${Math.min(currentUser.id, targetId)}_${Math.max(currentUser.id, targetId)}`;
      setSelectedChat({
        roomKey: roomKey,
        otherId: targetId,
        otherName: targetName
      });
    }

    return () => clearInterval(intervalId);
  }, [currentUser, navigate, targetUserId, selectedChat]);

  const filtered = conversations.filter(c =>
    c.otherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Jika ada selectedChat, render komponen RealTimeChatBox
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
          {/* FIX 2: Lempar otherId dan otherName yang akurat ke ChatBox */}
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
                      secondary={conv.lastMessage?.text?.substring(0, 50) || conv.lastMessage?.content?.substring(0, 50)}
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