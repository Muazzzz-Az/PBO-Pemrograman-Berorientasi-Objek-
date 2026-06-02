// src/components/RealTimeChatBox.js
import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/ChatService';
import {
  Box, TextField, Button, Typography, Paper, Avatar,
  Badge, CircularProgress, Divider, IconButton, Popover,
  List, ListItem, ListItemIcon, ListItemText, Snackbar, Alert,
  ImageList, ImageListItem, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

function RealTimeChatBox({ artistId, artistName, currentUser, commissionId, productTitle, productPrice, onMessageRead }) {
  // ========== SEMUA HOOKS DIATAS (SEBELUM RETURN CONDITIONAL) ==========
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewImage, setPreviewImage] = useState(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [canChat, setCanChat] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const isMounted = useRef(true);

  const validArtistId = parseInt(artistId);
  const validCurrentUserId = parseInt(currentUser?.id);
  const roomId = (validCurrentUserId && validArtistId)
    ? `room_${Math.min(validCurrentUserId, validArtistId)}_${Math.max(validCurrentUserId, validArtistId)}`
    : null;

  // ========== CEK STATUS CHAT (HOOK) ==========
  useEffect(() => {
    const commissionRequests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
    const purchaseRequests = JSON.parse(localStorage.getItem('purchase_requests') || '[]');
    const allRequests = [...commissionRequests, ...purchaseRequests];

    const hasAcceptedRequest = allRequests.some(req =>
      (req.artistId === validArtistId && req.buyerId === validCurrentUserId ||
       req.artistId === validCurrentUserId && req.buyerId === validArtistId) &&
      (req.status === 'accepted' || req.status === 'ongoing')
    );

    setCanChat(hasAcceptedRequest);
  }, [validArtistId, validCurrentUserId]);

  // File to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Kirim pesan media
  const sendMediaMessage = async (content, mediaType, fileName, fileSize) => {
    const newMessage = {
      id: Date.now(),
      text: '',
      content: content,
      mediaType: mediaType,
      fileName: fileName || null,
      fileSize: fileSize || null,
      senderId: validCurrentUserId,
      senderName: currentUser.fullName || currentUser.username,
      receiverId: validArtistId,
      roomId: roomId,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setChatLog(prev => [...prev, newMessage]);
    localStorage.setItem(`chat_${roomId}`, JSON.stringify([...chatLog, newMessage]));
    setMessage('');

    if (isConnected) {
      chatService.sendMessage(newMessage);
    }
  };

  // Handle upload gambar
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSnackbar({ open: true, message: 'Please upload an image file', severity: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'Image too large (max 5MB)', severity: 'error' });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      sendMediaMessage(base64, 'image', file.name);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to upload image', severity: 'error' });
    }

    e.target.value = '';
    setAnchorEl(null);
  };

  // Handle upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File too large (max 10MB)', severity: 'error' });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      sendMediaMessage(base64, 'file', file.name, file.size);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to upload file', severity: 'error' });
    }

    e.target.value = '';
    setAnchorEl(null);
  };

  // Handle kirim link
  const handleSendLink = () => {
    if (!linkUrl.trim()) return;

    const linkData = {
      url: linkUrl,
      title: linkTitle || linkUrl,
      type: 'link'
    };

    sendMediaMessage(linkData, 'link');
    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkTitle('');
    setAnchorEl(null);
  };

  // Kirim pesan teks biasa
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      content: message,
      mediaType: 'text',
      senderId: validCurrentUserId,
      senderName: currentUser.fullName || currentUser.username,
      receiverId: validArtistId,
      roomId: roomId,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setChatLog(prev => [...prev, newMessage]);
    localStorage.setItem(`chat_${roomId}`, JSON.stringify([...chatLog, newMessage]));
    setMessage('');

    if (isConnected) {
      chatService.sendMessage(newMessage);
    }
  };

  // Render pesan berdasarkan tipe
  const renderMessage = (msg) => {
    if (msg.mediaType === 'image') {
      return (
        <Box sx={{ maxWidth: 250 }}>
          <Box
            component="img"
            src={msg.content}
            alt="Shared image"
            sx={{
              maxWidth: '100%',
              maxHeight: 200,
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 }
            }}
            onClick={() => setPreviewImage(msg.content)}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>📷 Image</Typography>
        </Box>
      );
    }

    if (msg.mediaType === 'file') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, minWidth: 200 }}>
          <AttachFileIcon />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{msg.fileName}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>{msg.fileSize ? formatFileSize(msg.fileSize) : ''}</Typography>
          </Box>
          <IconButton size="small" component="a" href={msg.content} download={msg.fileName} sx={{ color: '#4A9FBF' }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    }

    if (msg.mediaType === 'link') {
      const link = typeof msg.content === 'object' ? msg.content : { url: msg.content, title: msg.content };
      return (
        <Box component="a" href={link.url} target="_blank" rel="noopener noreferrer" sx={{
          display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(74, 159, 191, 0.1)',
          borderRadius: 2, textDecoration: 'none', color: '#4A9FBF', '&:hover': { bgcolor: 'rgba(74, 159, 191, 0.2)' }
        }}>
          <LinkIcon />
          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{link.title || link.url}</Typography>
        </Box>
      );
    }

    return <Typography variant="body2">{msg.text || msg.content}</Typography>;
  };

  // Load chat history
  useEffect(() => {
    if (!currentUser || !roomId) return;
    const savedChat = JSON.parse(localStorage.getItem(`chat_${roomId}`) || '[]');
    setChatLog(savedChat);
    setLoading(false);
    return () => { isMounted.current = false; };
  }, [roomId, currentUser]);

  // Mark as read
  useEffect(() => {
    if (roomId && currentUser) {
      const key = `chat_${roomId}`;
      const messages = JSON.parse(localStorage.getItem(key) || '[]');
      let updated = false;
      const newMessages = messages.map(msg => {
        if (msg.receiverId === currentUser.id && !msg.isRead) {
          updated = true;
          return { ...msg, isRead: true };
        }
        return msg;
      });
      if (updated) {
        localStorage.setItem(key, JSON.stringify(newMessages));
        if (onMessageRead) onMessageRead();
        window.dispatchEvent(new Event('storage'));
      }
    }
  }, [roomId, currentUser, onMessageRead]);

  // Koneksi WebSocket
  useEffect(() => {
    if (!currentUser || !roomId) return;

    chatService.connect();
    const interval = setInterval(() => { setIsConnected(chatService.isConnected); }, 1000);
    const joinTimeout = setTimeout(() => { chatService.joinRoom(roomId); }, 500);

    const handleReceiveMessage = (data) => {
      if (data.roomId === roomId && isMounted.current) {
        setChatLog(prev => {
          const exists = prev.some(msg => msg.id === data.id);
          if (exists) return prev;
          const newLog = [...prev, data];
          localStorage.setItem(`chat_${roomId}`, JSON.stringify(newLog));
          return newLog;
        });
      }
    };

    const handleUserTyping = (data) => {
      if (data.roomId === roomId && isMounted.current) {
        setTypingUser(data.isTyping ? data.senderName : '');
      }
    };

    chatService.onMessage(handleReceiveMessage);
    chatService.onTyping(handleUserTyping);

    return () => {
      clearInterval(interval);
      clearTimeout(joinTimeout);
      chatService.leaveRoom(roomId);
      if (chatService.socket) {
        chatService.socket.off('receive_message', handleReceiveMessage);
        chatService.socket.off('user_typing', handleUserTyping);
      }
    };
  }, [roomId, currentUser]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

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

  const handleAttachClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseAttach = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  // ========== RETURN CONDITIONAL (SETELAH SEMUA HOOKS) ==========

  if (!currentUser) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '20px', bgcolor: '#FCE4EC' }}>
        <Typography variant="body1" color="#C2185B" sx={{ fontWeight: 600 }}>🔒 Login to Chat</Typography>
        <Typography variant="caption" color="text.secondary">Please login to discuss commission details</Typography>
      </Paper>
    );
  }

  if (!canChat) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '20px', bgcolor: '#FEF3C7' }}>
        <Typography variant="body1" color="#D97706" sx={{ fontWeight: 600 }}>🔒 Chat is locked</Typography>
        <Typography variant="caption" color="text.secondary">
          You can only chat with the artist after your commission request has been accepted.
        </Typography>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress sx={{ color: '#4A9FBF' }} />
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ borderRadius: '20px', overflow: 'hidden', height: '550px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <Box sx={{ p: 2, bgcolor: '#4A9FBF', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#FFFFFF', color: '#4A9FBF', fontWeight: 'bold' }}>{artistName?.charAt(0)}</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{artistName}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Badge color={isConnected ? "success" : "warning"} variant="dot" />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>{isConnected ? 'Online' : 'Connecting...'}</Typography>
              </Box>
            </Box>
          </Box>
          {!isConnected && <CircularProgress size={16} sx={{ color: '#FFFFFF' }} />}
        </Box>

        {/* Chat Area */}
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
                <Box key={`${msg.id}-${idx}`} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                  <Box sx={{
                    maxWidth: '80%',
                    bgcolor: isMe ? '#4A9FBF' : '#FFFFFF',
                    color: isMe ? '#FFFFFF' : '#1C2833',
                    p: 1.5,
                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold', opacity: 0.8 }}>
                      {isMe ? 'You' : msg.senderName}
                    </Typography>
                    {renderMessage(msg)}
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

        {/* Input Area */}
        <Divider />
        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: '#FFFFFF', display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton onClick={handleAttachClick} sx={{ color: '#4A9FBF' }}>
            <AttachFileIcon />
          </IconButton>
          <TextField fullWidth size="small" placeholder="Type a message..." value={message} onChange={handleTyping}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '40px', bgcolor: '#F8FAFC' } }} />
          <Button type="submit" variant="contained" disabled={!message.trim()}
            sx={{ bgcolor: '#4A9FBF', borderRadius: '40px', minWidth: 'auto', px: 3, '&:hover': { bgcolor: '#388EAC' } }}>
            <SendIcon />
          </Button>
        </Box>
      </Paper>

      {/* Menu Attach */}
      <Popover open={open} anchorEl={anchorEl} onClose={handleCloseAttach} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <List sx={{ minWidth: 200 }}>
          <ListItem button onClick={() => imageInputRef.current?.click()}>
            <ListItemIcon><ImageIcon sx={{ color: '#4A9FBF' }} /></ListItemIcon>
            <ListItemText primary="Upload Image" secondary="JPG, PNG, GIF up to 5MB" />
          </ListItem>
          <ListItem button onClick={() => fileInputRef.current?.click()}>
            <ListItemIcon><AttachFileIcon sx={{ color: '#4A9FBF' }} /></ListItemIcon>
            <ListItemText primary="Upload File" secondary="PDF, ZIP, DOC up to 10MB" />
          </ListItem>
          <ListItem button onClick={() => setLinkDialogOpen(true)}>
            <ListItemIcon><LinkIcon sx={{ color: '#4A9FBF' }} /></ListItemIcon>
            <ListItemText primary="Send Link" secondary="Share a URL" />
          </ListItem>
        </List>
      </Popover>

      {/* Hidden file inputs */}
      <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Send Link</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="URL" placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth label="Title (optional)" placeholder="Link title" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} />
        </DialogContent>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendLink} variant="contained" sx={{ bgcolor: '#4A9FBF' }}>Send</Button>
        </Box>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="md">
        <DialogContent sx={{ p: 0, bgcolor: '#000', display: 'flex', justifyContent: 'center' }}>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
        </DialogContent>
        <IconButton onClick={() => setPreviewImage(null)} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: '16px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}

export default RealTimeChatBox;