// src/components/ArtistDetail.js - Complete Fixed Version
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Card, CardContent, Typography, Avatar, Chip, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Divider, Rating, Stack, Alert, Snackbar, CircularProgress,
  Checkbox, FormControlLabel, Fade, Tooltip, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddLinkIcon from '@mui/icons-material/AddLink';
import VerifiedIcon from '@mui/icons-material/Verified';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InventoryIcon from '@mui/icons-material/Inventory';
import EmailIcon from '@mui/icons-material/Email';
import RealTimeChatBox from './RealTimeChatBox';

// ==========================================
// LOCALSTORAGE HELPERS
// ==========================================
const getArtistCommissions = () => {
  const saved = localStorage.getItem('creartsi_artist_commissions');
  return saved ? JSON.parse(saved) : [];
};

const getArtists = () => {
  const saved = localStorage.getItem('kreartsi_artists');
  return saved ? JSON.parse(saved) : [];
};

const getCurrentUser = () => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
};

const getAllUsers = () => {
  const saved = localStorage.getItem('registered_users');
  return saved ? JSON.parse(saved) : [];
};

// Get full artist data from user storage (for avatar, bio, etc)
const getFullArtistData = (artistName) => {
  if (!artistName) return null;

  // 1. Check current logged in user first
  const currentUser = getCurrentUser();
  if (currentUser && (currentUser.fullName === artistName || currentUser.username === artistName)) {
    return {
      id: currentUser.id,
      artistName: currentUser.fullName,
      name: currentUser.fullName,
      username: currentUser.username,
      bio: currentUser.bio || 'No bio yet',
      avatarUrl: currentUser.avatarUrl || null,
      profilePicture: currentUser.avatarUrl || 'https://i.pravatar.cc/150?img=1',
      rating: currentUser.rating || 5,
      totalReviews: currentUser.totalReviews || 0,
      isVerified: currentUser.isVerified === true,
      email: currentUser.email
    };
  }

  // 2. Check in artists list
  const artists = getArtists();
  let artist = artists.find(a => a.name === artistName || a.username === artistName);

  if (artist) {
    return {
      id: artist.id,
      artistName: artist.name,
      name: artist.name,
      username: artist.username || artist.name.toLowerCase().replace(/ /g, ''),
      bio: artist.bio || 'Professional artist',
      avatarUrl: artist.avatar || artist.profilePicture,
      profilePicture: artist.avatar || artist.profilePicture || 'https://i.pravatar.cc/150?img=1',
      rating: artist.rating || 5,
      totalReviews: artist.totalReviews || 0,
      isVerified: artist.isVerified || false
    };
  }

  // 3. Check in all registered users
  const allUsers = getAllUsers();
  const user = allUsers.find(u => u.fullName === artistName || u.username === artistName);

  if (user) {
    return {
      id: user.id,
      artistName: user.fullName,
      name: user.fullName,
      username: user.username,
      bio: user.bio || 'No bio yet',
      avatarUrl: user.avatarUrl || null,
      profilePicture: user.avatarUrl || 'https://i.pravatar.cc/150?img=1',
      rating: user.rating || 5,
      totalReviews: user.totalReviews || 0,
      isVerified: user.isVerified === true,
      email: user.email
    };
  }

  return null;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [commission, setCommission] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openRequest, setOpenRequest] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;

  // Form State
  const [requestData, setRequestData] = useState({
    email: currentUser?.email || '',
    twitter: '',
    instagram: '',
    usage: '',
    references: '',
    canStream: '',
    paymentMethod: '',
    extraInfo: '',
    agreeTerms: false
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedLinks, setUploadedLinks] = useState([]);
  const [newLink, setNewLink] = useState('');

  // Helpers
  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const requireLogin = () => {
    if (!isLoggedIn) {
      showNotification('Please login first to continue', 'warning');
      setTimeout(() => navigate('/login'), 1500);
      return false;
    }
    return true;
  };

  // Handlers
  const handleOpenRequest = () => {
    if (!requireLogin()) return;
    setOpenRequest(true);
    setRequestStep(1);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setUploadedLinks([...uploadedLinks, { id: Date.now(), url: newLink }]);
      setNewLink('');
    }
  };

  const removeLink = (id) => {
    setUploadedLinks(uploadedLinks.filter(l => l.id !== id));
  };

  const handleSubmitRequest = () => {
    if (!requestData.agreeTerms) {
      showNotification('Please agree to the Terms of Service', 'warning');
      return;
    }

    setSubmitting(true);
    setRequestStep(2);

    setTimeout(() => {
      const newRequest = {
        id: Date.now(),
        commissionId: parseInt(id),
        artistId: artist?.id,
        artistName: artist?.artistName,
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        buyerUsername: currentUser.username,
        buyerEmail: requestData.email,
        socialMedia: { twitter: requestData.twitter, instagram: requestData.instagram },
        usage: requestData.usage,
        references: requestData.references,
        files: uploadedFiles,
        links: uploadedLinks,
        canStream: requestData.canStream,
        paymentMethod: requestData.paymentMethod,
        extraInfo: requestData.extraInfo,
        commissionTitle: commission?.title,
        commissionPrice: commission?.priceFrom,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const requests = JSON.parse(localStorage.getItem('commission_requests') || '[]');
      requests.push(newRequest);
      localStorage.setItem('commission_requests', JSON.stringify(requests));

      // Send notification to artist
      const artistNotifs = JSON.parse(localStorage.getItem(`artist_notifications_${artist?.id}`) || '[]');
      artistNotifs.unshift({
        id: Date.now(),
        type: 'NEW_COMMISSION_REQUEST',
        title: 'New Commission Request',
        message: `${currentUser.fullName} (@${currentUser.username}) requested "${commission?.title}"`,
        requestId: newRequest.id,
        buyerName: currentUser.fullName,
        buyerUsername: currentUser.username,
        commissionTitle: commission?.title,
        price: commission?.priceFrom,
        isRead: false,
        timestamp: new Date().toISOString(),
        timeAgo: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem(`artist_notifications_${artist?.id}`, JSON.stringify(artistNotifs));

      // Also add to global notifications
      const globalNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      globalNotifications.unshift({
        id: Date.now(),
        message: `📢 New commission request from ${currentUser.fullName} for "${commission?.title}"`,
        type: 'COMMISSION_REQUEST',
        isRead: false,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem('user_notifications', JSON.stringify(globalNotifications));

      window.dispatchEvent(new Event('storage'));

      setSubmitting(false);
      setRequestStep(3);

      setTimeout(() => {
        setOpenRequest(false);
        setRequestStep(1);
        resetForm();
        showNotification('Request submitted successfully!', 'success');
      }, 2000);
    }, 1500);
  };

  const resetForm = () => {
    setRequestData({
      email: currentUser?.email || '',
      twitter: '',
      instagram: '',
      usage: '',
      references: '',
      canStream: '',
      paymentMethod: '',
      extraInfo: '',
      agreeTerms: false
    });
    setUploadedFiles([]);
    setUploadedLinks([]);
    setNewLink('');
  };

  // Load Data - Get REAL artist data
  useEffect(() => {
    const loadData = () => {
      setLoading(true);

      const commissions = getArtistCommissions();
      const foundCommission = commissions.find(c => c.id === parseInt(id));

      if (foundCommission) {
        setCommission(foundCommission);

        // Get REAL artist data based on artistName from commission
        const artistName = foundCommission.artistName;
        const fullArtistData = getFullArtistData(artistName);

        if (fullArtistData) {
          console.log('Artist data loaded:', fullArtistData);
          setArtist(fullArtistData);
        } else {
          // Fallback: create artist data from commission
          setArtist({
            id: foundCommission.artistId || Date.now(),
            artistName: foundCommission.artistName || 'Artist',
            name: foundCommission.artistName || 'Artist',
            username: foundCommission.artistName?.toLowerCase().replace(/ /g, '') || 'artist',
            bio: foundCommission.description || 'Professional artist',
            avatarUrl: null,
            profilePicture: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            totalReviews: 0,
            isVerified: false
          });
        }
      } else {
        showNotification('Commission not found', 'error');
        navigate('/artists');
      }

      setLoading(false);
    };

    loadData();
  }, [id, navigate]);

  if (loading || !commission || !artist) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#4A9FBF' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          component={Link}
          to="/artists"
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 4,
            color: '#1A6B8A',
            fontWeight: 600,
            borderRadius: '30px',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: 'rgba(74, 159, 191, 0.08)',
              transform: 'translateX(-4px)',
            }
          }}
        >
          Back to Artists
        </Button>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Image */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 20px 35px -10px rgba(0,0,0,0.1)',
            }}>
              <Box sx={{ position: 'relative', pt: '100%', bgcolor: '#F1F5F9' }}>
                <img
                  src={commission.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'}
                  alt={commission.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Chip
                  label={commission.isOpen ? 'OPEN' : 'CLOSED'}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    bgcolor: commission.isOpen ? '#10B981' : '#EF4444',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: '20px',
                  }}
                />
              </Box>
            </Card>
          </Grid>

          {/* Right Column - Details */}
          <Grid item xs={12} md={6}>
            <Card sx={{
              borderRadius: '28px',
              p: 4,
              boxShadow: '0 20px 35px -10px rgba(0,0,0,0.08)',
              height: '100%'
            }}>
              <Box>
                <Chip
                  label={commission.category}
                  size="small"
                  sx={{
                    bgcolor: '#E0F2FE',
                    color: '#1A6B8A',
                    fontWeight: 700,
                    borderRadius: '20px',
                    mb: 2
                  }}
                />

                <Typography variant="h4" fontWeight={800} sx={{ color: '#1A6B8A', mb: 2, lineHeight: 1.2 }}>
                  {commission.title}
                </Typography>

                <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.7 }}>
                  {commission.description || 'Professional custom artwork tailored to your needs.'}
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mb: 0.5 }}>
                    Starting from
                  </Typography>
                  <Typography variant="h2" fontWeight={800} sx={{ color: '#4A9FBF', fontSize: '2rem' }}>
                    Rp {commission.priceFrom?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>

                {/* Details Grid */}
                <Grid container spacing={2} sx={{ mb: 4, p: 2, bgcolor: '#F8FAFC', borderRadius: '20px' }}>
                  <Grid item xs={4}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <ScheduleIcon sx={{ color: '#4A9FBF', fontSize: 22, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Turnaround</Typography>
                      <Typography variant="body2" fontWeight={700}>{commission.turnaround || '7-14 days'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <AutorenewIcon sx={{ color: '#4A9FBF', fontSize: 22, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Revisions</Typography>
                      <Typography variant="body2" fontWeight={700}>{commission.revisions || 2} times</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <InventoryIcon sx={{ color: '#4A9FBF', fontSize: 22, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#94A3B8' }}>Slots Left</Typography>
                      <Typography variant="body2" fontWeight={700}>{commission.slotsLeft || commission.slots || 5}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* What's Included / Tags */}
                {commission.includes && commission.includes.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
                      What's Included
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {commission.includes.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          sx={{ bgcolor: '#F1F5F9', color: '#475569' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Artist Info - WITH REAL DATA from user */}
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2.5,
                    bgcolor: '#F8FAFC',
                    borderRadius: '20px',
                    mb: 4,
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={artist.avatarUrl || artist.profilePicture}
                      sx={{
                        width: 56,
                        height: 56,
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        bgcolor: '#4A9FBF'
                      }}
                    >
                      {(!artist.avatarUrl && !artist.profilePicture) && artist.artistName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" fontWeight={800}>{artist.artistName}</Typography>
                        {artist.isVerified && <VerifiedIcon sx={{ color: '#4A9FBF', fontSize: 16 }} />}
                      </Stack>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>@{artist.username}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Rating value={artist.rating || 5} precision={0.5} size="small" readOnly />
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>({artist.totalReviews || 0} reviews)</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Submit a commission request" arrow>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleOpenRequest}
                      disabled={!commission.isOpen}
                      sx={{
                        bgcolor: '#4A9FBF',
                        borderRadius: '50px',
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 14px rgba(74, 159, 191, 0.3)',
                        '&:hover': { bgcolor: '#1A6B8A', transform: 'translateY(-1px)' },
                        '&.Mui-disabled': { bgcolor: '#CBD5E1' }
                      }}
                    >
                      {commission.isOpen ? 'Request Commission' : 'Commission Closed'}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Chat with the artist" arrow>
                    <Button
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      onClick={() => setOpenChat(true)}
                      sx={{
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: '#4A9FBF',
                        color: '#4A9FBF',
                        '&:hover': { borderColor: '#1A6B8A', bgcolor: 'rgba(74, 159, 191, 0.05)' }
                      }}
                    >
                      Chat
                    </Button>
                  </Tooltip>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* ==================== REQUEST COMMISSION MODAL ==================== */}
      <Dialog
        open={openRequest}
        onClose={() => !submitting && setOpenRequest(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: '28px',
            overflow: 'hidden',
            maxHeight: '85vh'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white', py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <ShoppingCartIcon />
              <Typography fontWeight={800}>Commission Request</Typography>
            </Box>
            <IconButton onClick={() => setOpenRequest(false)} sx={{ color: 'white', p: 0.5 }} disabled={submitting}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ py: 3, px: 4, bgcolor: '#F8FAFC' }}>
          {requestStep === 1 && (
            <Box>
              {/* Header Info */}
              <Box sx={{
                mb: 3,
                p: 2,
                bgcolor: '#E0F2FE',
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#1A6B8A' }}>
                  🎨 Requesting as @{currentUser?.username || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  Artist will review and respond to your request
                </Typography>
              </Box>

              {/* Email */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1A6B8A' }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                placeholder="your@email.com"
                value={requestData.email}
                onChange={(e) => setRequestData({...requestData, email: e.target.value})}
                sx={{ mb: 3 }}
              />

              {/* Social Media */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: '#64748B' }}>
                Social Media (Optional)
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField size="small" fullWidth placeholder="Twitter" value={requestData.twitter} onChange={(e) => setRequestData({...requestData, twitter: e.target.value})} />
                </Grid>
                <Grid item xs={6}>
                  <TextField size="small" fullWidth placeholder="Instagram" value={requestData.instagram} onChange={(e) => setRequestData({...requestData, instagram: e.target.value})} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Usage Type */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1A6B8A' }}>
                Usage Type <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={requestData.usage}
                onChange={(e) => setRequestData({...requestData, usage: e.target.value})}
                sx={{ mb: 3 }}
              >
                <MenuItem value="personal">🎨 Personal Use Only</MenuItem>
                <MenuItem value="commercial">💼 Commercial Use (Streaming/Social Media)</MenuItem>
                <MenuItem value="merch">🛍️ Commercial Merchandising</MenuItem>
              </TextField>

              {/* References */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1A6B8A' }}>
                References & Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe your character, provide references, mood boards, sample poses..."
                value={requestData.references}
                onChange={(e) => setRequestData({...requestData, references: e.target.value})}
                sx={{ mb: 3 }}
              />

              {/* File Upload */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#64748B' }}>
                Attachments
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  size="small"
                  sx={{ borderRadius: '30px', textTransform: 'none', borderColor: '#4A9FBF', color: '#4A9FBF' }}
                >
                  Upload Files
                  <input type="file" hidden multiple onChange={handleFileUpload} />
                </Button>
                {uploadedFiles.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {uploadedFiles.map((file) => (
                      <Chip key={file.id} label={file.name} size="small" onDelete={() => removeFile(file.id)} sx={{ borderRadius: '16px', height: 28 }} />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Reference Links */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#64748B' }}>
                Reference Links
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Add link (Google Drive, Dropbox, etc.)"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLink()}
                />
                <Button variant="outlined" onClick={addLink} size="small" sx={{ borderRadius: '30px', textTransform: 'none', px: 3 }}>
                  Add
                </Button>
              </Box>
              {uploadedLinks.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                  {uploadedLinks.map((link) => (
                    <Chip key={link.id} label={link.url.length > 35 ? link.url.substring(0, 35) + '...' : link.url} size="small" onDelete={() => removeLink(link.id)} sx={{ borderRadius: '16px', height: 28 }} />
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {/* Stream Permission & Payment Method */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1A6B8A' }}>
                    Stream Permission
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={requestData.canStream}
                    onChange={(e) => setRequestData({...requestData, canStream: e.target.value})}
                  >
                    <MenuItem value="yes">✓ Yes, with credit</MenuItem>
                    <MenuItem value="no">✗ No, private only</MenuItem>
                    <MenuItem value="ask">❓ Ask me first</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#1A6B8A' }}>
                    Payment Method
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={requestData.paymentMethod}
                    onChange={(e) => setRequestData({...requestData, paymentMethod: e.target.value})}
                  >
                    <MenuItem value="full">💰 Pay in full</MenuItem>
                    <MenuItem value="half">💳 50% / 50%</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              {/* Extra Info */}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#64748B' }}>
                Extra Information (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Pose, traits, multiple characters, add-ons, special requests..."
                value={requestData.extraInfo}
                onChange={(e) => setRequestData({...requestData, extraInfo: e.target.value})}
                sx={{ mb: 3 }}
              />

              {/* Price Summary */}
              <Box sx={{
                p: 2.5,
                bgcolor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                textAlign: 'center',
                mb: 2
              }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>Estimated Price</Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#1A6B8A', fontSize: '1.75rem' }}>
                  Rp {commission.priceFrom?.toLocaleString('id-ID') || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Artist may quote a different price after review
                </Typography>
              </Box>

              {/* Terms */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={requestData.agreeTerms}
                    onChange={(e) => setRequestData({...requestData, agreeTerms: e.target.checked})}
                    size="small"
                    sx={{ color: '#4A9FBF', '&.Mui-checked': { color: '#4A9FBF' } }}
                  />
                }
                label={
                  <Typography variant="caption">
                    I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                  </Typography>
                }
              />
            </Box>
          )}

          {requestStep === 2 && (
            <Box textAlign="center" py={6}>
              <CircularProgress sx={{ color: '#4A9FBF', mb: 2 }} />
              <Typography variant="body1">Submitting your request...</Typography>
            </Box>
          )}

          {requestStep === 3 && (
            <Box textAlign="center" py={6}>
              <Box sx={{ fontSize: 56, mb: 2 }}>✅</Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#10B981', mb: 1 }}>Request Submitted!</Typography>
              <Typography variant="body2" color="text.secondary">
                Your commission request has been sent to {artist.artistName}
              </Typography>
            </Box>
          )}
        </DialogContent>

        {requestStep === 1 && (
          <DialogActions sx={{ p: 2.5, bgcolor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
            <Button onClick={() => setOpenRequest(false)} variant="outlined" sx={{ borderRadius: '30px', textTransform: 'none', px: 4 }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              variant="contained"
              disabled={!requestData.email || !requestData.usage || !requestData.agreeTerms}
              sx={{ bgcolor: '#4A9FBF', borderRadius: '30px', textTransform: 'none', px: 4, '&:hover': { bgcolor: '#1A6B8A' } }}
            >
              Submit Request
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* ==================== CHAT MODAL ==================== */}
      <Dialog open={openChat} onClose={() => setOpenChat(false)} maxWidth="sm" fullWidth TransitionComponent={Fade}>
        <DialogTitle sx={{ bgcolor: '#4A9FBF', color: 'white', py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={800}>Chat with {artist.artistName}</Typography>
            <IconButton onClick={() => setOpenChat(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <RealTimeChatBox
            artistId={artist.id}
            artistName={artist.artistName}
            currentUser={currentUser}
            commissionId={commission.id}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: '16px' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default ArtistDetail;