// src/components/ProfilePage.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip
} from '@mui/material';

import {
  Edit as EditIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  InfoOutlined as InfoOutlinedIcon,
  Add as AddIcon,
  Link as LinkIcon,
  DeleteOutlined as DeleteOutlineIcon,
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

// Import komponen Artist Dashboard
import ArtistDashboardTab from './artist/ArtistDashboardTab';
import ShopManager from './artist/ShopManager';
import { updateUser, getCurrentUser } from '../services/userService';

const formatJoinedDate = (dateString) => {
  if (!dateString) return 'MAY 2026';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  }).toUpperCase();
};

function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [activeCreatorTab, setActiveCreatorTab] = useState(0);
  const [showCreatorMode, setShowCreatorMode] = useState(false);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // ONLY check isVerified === true - NOT role!
  const isVerifiedArtist = user?.isVerified === true;

  // Listen for creator tab query parameter to auto-enable Creator Mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'creator' && isVerifiedArtist) {
      setShowCreatorMode(true);
    } else {
      setShowCreatorMode(false);
    }
  }, [location.search, isVerifiedArtist]);

  // Listen for user updates from other components
  useEffect(() => {
    const handleUserUpdate = (event) => {
      if (event.detail && setUser) {
        setUser(event.detail);
      }
    };

    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, [setUser]);

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
        links: user.links || []
      });
    }
  }, [user]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
    bannerUrl: user?.bannerUrl || '',
    links: user?.links || []
  });

  const [modalData, setModalData] = useState({ ...formData });
  const [linkStyle, setLinkStyle] = useState('labels');
  const [displayLocalTimeProfile, setDisplayLocalTimeProfile] = useState(true);
  const [displayLocalTimeDMs, setDisplayLocalTimeDMs] = useState(false);

  const handleOpenModal = () => {
    setModalData({ ...formData });
    setOpenEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setModalData({ ...modalData, avatarUrl: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setModalData({ ...modalData, bannerUrl: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    setModalData({
      ...modalData,
      links: [...modalData.links, { label: 'New Link', url: 'https://' }]
    });
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...modalData.links];
    updatedLinks[index][field] = value;
    setModalData({ ...modalData, links: updatedLinks });
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = modalData.links.filter((_, i) => i !== index);
    setModalData({ ...modalData, links: updatedLinks });
  };

const handleSave = () => {
  const updatedUser = { ...user, ...modalData };
  updateUser(updatedUser);  // ← Gunakan fungsi dari userService
  setUser(updatedUser);
  setOpenEditModal(false);
};

  const handleGoToCreatorMode = () => {
    setShowCreatorMode(true);
  };

  const handleBackToProfile = () => {
    setShowCreatorMode(false);
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Creator Mode - ONLY for verified artists
  if (showCreatorMode && isVerifiedArtist) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', pb: 8 }}>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A' }}>
                🎨 Creator Studio
              </Typography>
              <Typography variant="body2" sx={{ color: '#4A9FBF' }}>
                Manage your portfolio, commissions, and shop
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={handleBackToProfile}
              sx={{ borderColor: '#4A9FBF', color: '#4A9FBF', borderRadius: '20px' }}
            >
              ← Back to Profile
            </Button>
          </Box>

          <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
            <Tabs
              value={activeCreatorTab}
              onChange={(e, newVal) => setActiveCreatorTab(newVal)}
              sx={{
                borderBottom: '1px solid rgba(74, 159, 191, 0.15)',
                px: 2,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: '#64748B' },
                '& .Mui-selected': { color: '#4A9FBF !important' },
                '& .MuiTabs-indicator': { bgcolor: '#4A9FBF' }
              }}
            >
              <Tab icon={<PaletteIcon />} iconPosition="start" label="Portfolio & Commissions" />
              <Tab icon={<StoreIcon />} iconPosition="start" label="Shop" />
              <Tab icon={<DashboardIcon />} iconPosition="start" label="Analytics" />
            </Tabs>

            <Box sx={{ p: 4 }}>
              {activeCreatorTab === 0 && <ArtistDashboardTab />}
              {activeCreatorTab === 1 && <ShopManager user={user} />}
              {activeCreatorTab === 2 && (
                <Box textAlign="center" py={8}>
                  <Typography variant="body1" color="text.secondary">
                    📊 Analytics coming soon! Sales statistics and performance metrics.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Container>
      </Box>
    );
  }

  // Normal Profile View
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', pb: 8 }}>
      <Box
        sx={{
          height: '280px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          background: formData.bannerUrl
            ? `url(${formData.bannerUrl}) center/cover no-repeat`
            : 'linear-gradient(135deg, #BAE6FD 0%, #E0F2FE 100%)',
          borderBottom: '1px solid rgba(74, 159, 191, 0.2)'
        }}
      />

      <Container
        maxWidth="md"
        sx={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '-85px' }}
      >
        <Box sx={{ mb: 3, display: 'inline-block', position: 'relative' }}>
          <Avatar
            src={formData.avatarUrl}
            sx={{
              width: 150,
              height: 150,
              border: '6px solid #FFFFFF',
              boxShadow: '0 10px 25px rgba(74, 159, 191, 0.25)',
              bgcolor: '#4A9FBF',
              fontSize: '3.8rem',
              fontWeight: 'bold'
            }}
          >
            {!formData.avatarUrl && formData.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          {isVerifiedArtist && (
            <Chip
              label="✓ Verified Artist"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: -10,
                bgcolor: '#4A9FBF',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem'
              }}
            />
          )}
        </Box>

        <Box sx={{ width: '100%', maxWidth: '600px', px: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 0.5, letterSpacing: '-0.5px' }}>
            {formData.fullName}
          </Typography>
          <Typography variant="body1" sx={{ color: '#4A9FBF', fontWeight: 600, mb: 2 }}>
            @{formData.username}
          </Typography>

          {displayLocalTimeProfile && (
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mb: 2, bgcolor: '#E0F2FE', display: 'inline-block', px: 2, py: 0.5, borderRadius: '12px' }}>
              🕒 Local Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          )}

          <Divider sx={{ mb: 3, width: '60px', mx: 'auto', height: '4px', bgcolor: '#4A9FBF', borderRadius: '2px', opacity: 0.4 }} />

          <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 3, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
            {formData.bio || 'No bio yet'}
          </Typography>

          {formData.links && formData.links.length > 0 && (
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1.5} sx={{ mb: 4 }}>
              {formData.links.map((link, idx) => (
                <Button
                  key={idx}
                  href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={linkStyle === 'icon' ? <LinkIcon /> : null}
                  sx={{
                    bgcolor: '#4A9FBF',
                    color: '#FFFFFF',
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: linkStyle === 'labels' ? 3 : 2,
                    minWidth: linkStyle === 'icon' ? '40px' : 'auto',
                    boxShadow: '0 4px 12px rgba(74, 159, 191, 0.2)',
                    '&:hover': { bgcolor: '#1A6B8A', boxShadow: '0 6px 16px rgba(26, 107, 138, 0.3)' }
                  }}
                >
                  {linkStyle === 'labels' ? link.label : (linkStyle === 'icon' ? '' : <LinkIcon />)}
                  {linkStyle === 'labels' && <LinkIcon sx={{ ml: 1, fontSize: '1rem' }} />}
                </Button>
              ))}
            </Box>
          )}

          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, display: 'block', mb: 4, letterSpacing: '0.5px' }}>
            JOINED SINCE {formatJoinedDate(user?.createdAt)}
          </Typography>

          <Box display="flex" gap={2} justifyContent="center">
            <Button
              startIcon={<EditIcon />}
              onClick={handleOpenModal}
              variant="outlined"
              sx={{
                borderColor: '#4A9FBF',
                color: '#4A9FBF',
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                borderWidth: '2px',
                '&:hover': { borderWidth: '2px', borderColor: '#1A6B8A', bgcolor: 'rgba(74, 159, 191, 0.08)' }
              }}
            >
              Edit Profile
            </Button>

            {/* Creator Mode button - ONLY for verified artists (isVerified === true) */}
            {isVerifiedArtist && (
              <Button
                startIcon={<DashboardIcon />}
                onClick={handleGoToCreatorMode}
                variant="contained"
                sx={{
                  bgcolor: '#1A6B8A',
                  borderRadius: '24px',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  '&:hover': { bgcolor: '#0E4B63' }
                }}
              >
                🎨 Creator Mode
              </Button>
            )}
          </Box>
        </Box>
      </Container>

      {/* Edit Modal */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="xs"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            bgcolor: '#FFFFFF',
            color: '#1A6B8A',
            borderRadius: '20px',
            boxShadow: '0px 15px 35px rgba(74, 159, 191, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid #E0F2FE' }}>
          <IconButton onClick={() => setOpenEditModal(false)} sx={{ color: '#4A9FBF', p: 0.5 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A6B8A' }}>
            Edit Profile
          </Typography>
          <Button
            onClick={handleSave}
            sx={{ color: '#4A9FBF', fontWeight: 700, textTransform: 'none', fontSize: '0.95rem', p: 0 }}
          >
            Done
          </Button>
        </DialogTitle>

        <DialogContent sx={{ px: 2.5, py: 3, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#F8FAFC' }}>
          {/* Photo & Cover */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Photo & Cover</Typography>

            <Box
              sx={{
                width: '100%',
                height: '110px',
                borderRadius: '12px',
                position: 'relative',
                background: modalData.bannerUrl
                  ? `url(${modalData.bannerUrl}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #BAE6FD 0%, #E0F2FE 100%)',
                border: '2px dashed #BAE6FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconButton
                onClick={() => bannerInputRef.current.click()}
                sx={{ bgcolor: 'rgba(255,255,255,0.8)', color: '#1A6B8A', '&:hover': { bgcolor: '#FFFFFF' } }}
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>

              <Box
                onClick={() => avatarInputRef.current.click()}
                sx={{
                  position: 'absolute', bottom: '-20px', left: '20px', cursor: 'pointer', zIndex: 10,
                  '&:hover .avatar-modal-overlay': { opacity: 1 }
                }}
              >
                <Avatar
                  src={modalData.avatarUrl}
                  sx={{ width: 64, height: 64, border: '4px solid #FFFFFF', bgcolor: '#4A9FBF', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                >
                  {!modalData.avatarUrl && modalData.fullName?.charAt(0).toUpperCase()}
                </Avatar>
                <Box
                  className="avatar-modal-overlay"
                  sx={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%',
                    bgcolor: 'rgba(74, 159, 191, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: '0.2s', border: '4px solid #FFFFFF'
                  }}
                >
                  <PhotoCameraIcon sx={{ color: '#FFF', fontSize: '1rem' }} />
                </Box>
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button
                size="small"
                onClick={() => bannerInputRef.current.click()}
                sx={{ color: '#4A9FBF', border: '1px solid #BAE6FD', borderRadius: '8px', textTransform: 'none', fontSize: '0.75rem', px: 1.5, bgcolor: '#FFFFFF' }}
              >
                Change Cover
              </Button>
            </Box>
          </Box>

          <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
          <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleBannerChange} />

          {/* Username */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Username</Typography>
            <TextField
              name="username"
              value={modalData.username}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#334155',
                  bgcolor: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#BAE6FD' },
                  '&.Mui-focused fieldset': { borderColor: '#4A9FBF' }
                }
              }}
            />
            <Box display="flex" gap={1} sx={{ mt: 0.5 }}>
              <InfoOutlinedIcon sx={{ color: '#4A9FBF', fontSize: '1rem', mt: 0.2, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.4, fontSize: '0.75rem' }}>
                Changing your username will also update your profile URL.
              </Typography>
            </Box>
          </Box>

          {/* Display Name */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Display name</Typography>
            <TextField
              name="fullName"
              value={modalData.fullName}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#334155',
                  bgcolor: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#BAE6FD' },
                  '&.Mui-focused fieldset': { borderColor: '#4A9FBF' }
                }
              }}
            />
          </Box>

          {/* Bio */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Bio</Typography>
            <TextField
              name="bio"
              value={modalData.bio}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#334155',
                  bgcolor: '#FFFFFF',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#BAE6FD' },
                  '&.Mui-focused fieldset': { borderColor: '#4A9FBF' }
                }
              }}
            />
          </Box>

          {/* Links */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Links</Typography>

            <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', borderRadius: '24px', p: 0.5, border: '1px solid #E2E8F0', mb: 1 }}>
              <Button
                fullWidth
                onClick={() => setLinkStyle('icon')}
                sx={{
                  borderRadius: '20px', textTransform: 'none', fontSize: '0.82rem', fontWeight: 600,
                  color: linkStyle === 'icon' ? '#1A6B8A' : '#64748B',
                  bgcolor: linkStyle === 'icon' ? '#FFFFFF' : 'transparent',
                  boxShadow: linkStyle === 'icon' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Icon only
              </Button>
              <Button
                fullWidth
                onClick={() => setLinkStyle('labels')}
                sx={{
                  borderRadius: '20px', textTransform: 'none', fontSize: '0.82rem', fontWeight: 600,
                  color: linkStyle === 'labels' ? '#1A6B8A' : '#64748B',
                  bgcolor: linkStyle === 'labels' ? '#FFFFFF' : 'transparent',
                  boxShadow: linkStyle === 'labels' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                Display labels
              </Button>
            </Box>

            {modalData.links && modalData.links.map((link, index) => (
              <Box key={index} display="flex" gap={1} alignItems="center" sx={{ mb: 1, bgcolor: '#FFFFFF', p: 1.5, borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Box display="flex" flexDirection="column" gap={1} flexGrow={1}>
                  <TextField
                    size="small"
                    label="Platform Name / Label"
                    value={link.label}
                    onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                  />
                  <TextField
                    size="small"
                    label="URL Link"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
                  />
                </Box>
                <IconButton onClick={() => handleRemoveLink(index)} sx={{ color: '#EF4444' }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button
              fullWidth
              onClick={handleAddLink}
              startIcon={<AddIcon />}
              sx={{
                mt: 0.5, bgcolor: '#E0F2FE', color: '#1A6B8A', textTransform: 'none', borderRadius: '24px', py: 0.8, fontSize: '0.85rem', fontWeight: 600,
                '&:hover': { bgcolor: '#BAE6FD' }
              }}
            >
              Add link
            </Button>
          </Box>

          {/* Local Time */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Local time</Typography>
            <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.4, fontSize: '0.75rem', mb: 0.5 }}>
              Showing "Local time" publicly helps others estimate your response time.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', borderRadius: '14px', px: 2, py: 0.5, border: '1px solid #E2E8F0' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.85rem' }}>Display on profile</Typography>
                <Switch
                  checked={displayLocalTimeProfile}
                  onChange={(e) => setDisplayLocalTimeProfile(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#4A9FBF' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4A9FBF' }
                  }}
                />
              </Box>
              <Divider sx={{ borderColor: '#F1F5F9' }} />
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, fontSize: '0.85rem' }}>Display in DMs</Typography>
                <Switch
                  checked={displayLocalTimeDMs}
                  onChange={(e) => setDisplayLocalTimeDMs(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#4A9FBF' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#4A9FBF' }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenEditModal(false)} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4A9FBF' }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilePage;