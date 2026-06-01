import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Box, TextField, Button, Typography, Paper, List, ListItem } from '@mui/material';

let socket;

function ChatBox({ artistId, artistName, currentUser }) {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const messagesEndRef = useRef(null);

    //  1. AMBIL ID ASLI DARI DATABASE LOKAL
    // Cari user di registered_users yang namanya cocok dengan artistName (misal: aoriinoyo5)
    const allUsers = JSON.parse(localStorage.getItem('registered_users')) || [];
    const targetArtist = allUsers.find(u => u.username === artistName || u.fullName === artistName);

    // Jika ketemu di local storage (ID 8), pakai itu. Jika tidak, pakai artistId bawaan.
    const validArtistId = targetArtist?.id ? targetArtist.id : artistId;

    //  2. ROOM ID SEKARANG AMAN UNTUK SEMUA AKUN
    const roomId = currentUser ? `room_${currentUser.id}_${validArtistId}` : null;

    useEffect(() => {
        if (!currentUser || !roomId) return;

        // Load riwayat chat dari localStorage
        const savedChat = JSON.parse(localStorage.getItem(`chat_${roomId}`) || '[]');
        setChatLog(savedChat);

        // Koneksikan ke socket.io server
        // Ganti localhost jadi 127.0.0.1
        socket = io('http://127.0.0.1:8085', {
            transports: ['websocket'],
            upgrade: false
        });

        socket.emit('join_room', roomId);

        socket.on('receive_message', (data) => {
            setChatLog((prev) => {
                const updated = [...prev, data];
                localStorage.setItem(`chat_${roomId}`, JSON.stringify(updated));
                return updated;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatLog]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const messageData = {
            id: Date.now(),
            text: message,
            content: message,
            senderId: currentUser.id,
            senderName: currentUser.fullName || currentUser.username,
            receiverId: validArtistId, // Menggunakan ID yang sudah valid
            roomId: roomId,
            timestamp: new Date().toISOString(),
            isRead: false
        };

        // Simpan ke localStorage
        const savedChat = JSON.parse(localStorage.getItem(`chat_${roomId}`) || '[]');
        savedChat.push(messageData);
        localStorage.setItem(`chat_${roomId}`, JSON.stringify(savedChat));

        // Kirim ke socket server jika terkoneksi
        if (socket && socket.connected) {
            socket.emit('send_message', messageData);
        }

        setChatLog([...chatLog, messageData]);
        setMessage('');
    };

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
            <Box bgcolor="#4A9FBF" p={2} color="#FFFFFF">
                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>💬 Chat dengan {artistName}</Typography>
                <Typography variant="caption" style={{ opacity: 0.85 }}>Diskusikan konsep art & negosiasi harga di sini</Typography>
            </Box>

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
                                        {msg.text || msg.content}
                                    </Typography>
                                </Box>
                            </ListItem>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

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