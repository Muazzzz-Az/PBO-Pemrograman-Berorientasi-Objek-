import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

let socket;

function ChatBox({ artistId, artistName, currentUser }) {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const messagesEndRef = useRef(null);

    // Membuat Room ID unik gabungan ID Pembeli dan ID Artist
    // Format: room_pembeliID_artistID
    const roomId = currentUser ? `room_${currentUser.id}_${artistId}` : null;

    useEffect(() => {
        if (!currentUser) return;

        const token = localStorage.getItem('token');

        // Koneksikan ke server socket dengan menyertakan Token Auth
        socket = io('http://localhost:8080', {
            auth: { token }
        });

        // Masuk ke room khusus transaksi ini
        socket.emit('join_room', roomId);

        // Dengarkan pesan masuk dari lawan bicara
        socket.on('receive_message', (data) => {
            setChatLog((prev) => [...prev, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId, currentUser]);

    // Auto scroll ke pesan paling bawah tiap ada chat baru
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatLog]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        const messageData = {
            roomId: roomId,
            text: message,
            senderId: currentUser.id
        };

        // Kirim pesan ke socket server
        socket.emit('send_message', messageData);
        setMessage('');
    };
    // Add this to existing ChatBox.js - modify handleSendMessage
    const handleSendMessage = () => {
      if (message.trim() === '') return;

      const messageData = {
        id: Date.now(),
        text: message,
        senderId: currentUser.id,
        senderName: currentUser.fullName || currentUser.username,
        receiverId: artistId,
        roomId: roomId,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      // Save to localStorage
      const savedChat = JSON.parse(localStorage.getItem(`chat_${roomId}`) || '[]');
      savedChat.push(messageData);
      localStorage.setItem(`chat_${roomId}`, JSON.stringify(savedChat));

      // Update UI
      setChatLog([...chatLog, messageData]);
      setMessage('');
    };

    // PROTEKSI: Jika user belum login, tampilkan pesan peringatan
    if (!currentUser) {
        return (
            <Paper style={{ padding: '24px', textAlign: 'center', borderRadius: '16px', backgroundColor: '#FCE4EC', border: '1px solid #F8BBD0' }}>
                <Typography variant="body1" color="#C2185B" style={{ fontWeight: 600 }}>
                    🔒 Akses Chat Dikunci
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" style={{ marginTop: '4px' }}>
                    Anda harus masuk ke akun CreartsI terlebih dahulu untuk memulai diskusi komisi dengan seniman ini.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper style={{ borderRadius: '20px', border: '1px solid rgba(74, 159, 191, 0.2)', overflow: 'hidden' }}>
            {/* Header Chat */}
            <Box bgcolor="#4A9FBF" p={2} color="#FFFFFF">
                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>💬 Chat dengan {artistName}</Typography>
                <Typography variant="caption" style={{ opacity: 0.85 }}>Diskusikan konsep art & negosiasi harga di sini</Typography>
            </Box>

            {/* Log Chat */}
            <Box style={{ height: '300px', overflowY: 'auto', padding: '16px', backgroundColor: '#F2F7F9' }}>
                <List disablePadding>
                    {chatLog.map((msg, index) => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                            <ListItem key={index} style={{ justifyContent: isMe ? 'flex-end' : 'flex-start', padding: '4px 0' }}>
                                <Box style={{
                                    backgroundColor: isMe ? '#4A9FBF' : '#FFFFFF',
                                    color: isMe ? '#FFFFFF' : '#1C2833',
                                    padding: '10px 14px',
                                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                    maxWidth: '75%',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                    border: isMe ? 'none' : '1px solid rgba(74, 159, 191, 0.1)'
                                }}>
                                    <Typography variant="caption" display="block" style={{ fontWeight: 700, fontSize: '0.75rem', opacity: isMe ? 0.9 : 1, color: isMe ? '#E6F5E5' : '#1A6B8A' }}>
                                        {isMe ? 'Anda' : msg.senderName}
                                    </Typography>
                                    <Typography variant="body2" style={{ marginTop: '2px', wordBreak: 'break-word' }}>
                                        {msg.text}
                                    </Typography>
                                </Box>
                            </ListItem>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

            {/* Input Form Chat */}
            <Box component="form" onSubmit={handleSendMessage} p={1.5} bgcolor="#FFFFFF" display="flex" gap={1} borderTop="1px solid rgba(74, 159, 191, 0.1)">
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Ketik pesan komisi..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    variant="outlined"
                    style={{ backgroundColor: '#F2F7F9', borderRadius: '12px' }}
                    InputProps={{ style: { borderRadius: '12px' } }}
                />
                <Button type="submit" variant="contained" color="primary" style={{ color: '#FFFFFF', borderRadius: '12px' }}>
                    Kirim
                </Button>
            </Box>
        </Paper>
    );
}

export default ChatBox;