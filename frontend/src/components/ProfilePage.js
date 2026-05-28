import React, { useState, useRef } from 'react';
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
  IconButton,
  Switch
} from '@mui/material';

// MENGGUNAKAN DELETEOUTLINED (DENGAN AKHIRAN 'D') SESUAI EXPORTS YANG VALID
import {
  Edit as EditIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  InfoOutlined as InfoOutlinedIcon,
  Add as AddIcon,
  Link as LinkIcon,
  DeleteOutlined as DeleteOutlineIcon
} from '@mui/icons-material';

const formatJoinedDate = (dateString) => {
  if (!dateString) return 'MEI 2026';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long'
  }).toUpperCase();
};

function ProfilePage({ user, setUser }) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // State Utama Data Profil (Sinkron Luar-Dalam)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Nailah Salmah',
    username: user?.username || 'naiii',
    bio: user?.bio || 'Suka coding web backend & suka main game horror hwhw. 🎨✨',
    avatarUrl: user?.avatarUrl || '',
    bannerUrl: user?.bannerUrl || '',
    links: user?.links || [
      { label: 'GitHub', url: 'https://github.com' }
    ]
  });

  // State Kontrol Sementara di dalam Modal
  const [modalData, setModalData] = useState({ ...formData });
  const [linkStyle, setLinkStyle] = useState('labels');
  const [displayLocalTimeProfile, setDisplayLocalTimeProfile] = useState(true);
  const [displayLocalTimeDMs, setDisplayLocalTimeDMs] = useState(false);

  // Fungsi sinkronisasi saat membuka modal edit
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

  // Dinamisasi Fitur Tambah Link
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
    setFormData({ ...modalData });
    setOpenEditModal(false);
    if (setUser) {
      setUser({ ...user, ...modalData });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F0F9FF', pb: 8 }}>

      {/* ==================== DISPLAY UTAMA HALAMAN PROFIL ==================== */}
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
        {/* Avatar Base */}
        <Box sx={{ mb: 3, display: 'inline-block' }}>
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
            {!formData.avatarUrl && formData.fullName.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Box sx={{ width: '100%', maxWidth: '600px', px: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1A6B8A', mb: 0.5, letterSpacing: '-0.5px' }}>
            {formData.fullName}
          </Typography>
          <Typography variant="body1" sx={{ color: '#4A9FBF', fontWeight: 600, mb: 2 }}>
            @{formData.username}
          </Typography>

          {/* Menampilkan Jam Lokal jika Sakelar Switch Aktif */}
          {displayLocalTimeProfile && (
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mb: 2, bgcolor: '#E0F2FE', display: 'inline-block', px: 2, py: 0.5, borderRadius: '12px' }}>
              🕒 Waktu Lokal: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </Typography>
          )}

          <Divider sx={{ mb: 3, width: '60px', mx: 'auto', height: '4px', bgcolor: '#4A9FBF', borderRadius: '2px', opacity: 0.4 }} />

          <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 3, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
            {formData.bio}
          </Typography>

          {/* RENDER LINKS DINAMIS */}
          {formData.links.length > 0 && (
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1.5} sx={{ mb: 4 }}>
              {formData.links.map((link, idx) => (
                <Button
                  key={idx}
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
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
            BERGABUNG SEJAK {formatJoinedDate(user?.createdAt)}
          </Typography>

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
            Edit Profil
          </Button>
        </Box>
      </Container>


      {/* ==================== MODAL WINDOW ==================== */}
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
        {/* Header Modal */}
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2, borderBottom: '1px solid #E0F2FE' }}>
          <IconButton onClick={() => setOpenEditModal(false)} sx={{ color: '#4A9FBF', p: 0.5 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A6B8A' }}>
            Edit profile
          </Typography>
          <Button
            onClick={handleSave}
            sx={{ color: '#4A9FBF', fontWeight: 700, textTransform: 'none', fontSize: '0.95rem', p: 0, '&:hover': { bgcolor: 'transparent', color: '#1A6B8A' } }}
          >
            Done
          </Button>
        </DialogTitle>

        {/* Isi Form Konten */}
        <DialogContent sx={{ px: 2.5, py: 3, display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#F8FAFC' }}>

          {/* Box Media (Banner Mini Pastel + Avatar) */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Foto & Sampul</Typography>

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
                  {!modalData.avatarUrl && modalData.fullName.charAt(0).toUpperCase()}
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
                Ubah Sampul
              </Button>
            </Box>
          </Box>

          <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleAvatarChange} />
          <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleBannerChange} />

          {/* Input Username */}
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
                Mengubah username juga akan memperbarui URL profilmu.
              </Typography>
            </Box>
          </Box>

          {/* Input Display Name */}
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

          {/* Input Bio */}
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

          {/* SECTION LINKS DINAMIS & AKTIF */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Links</Typography>

            {/* Toggle Tipe Tampilan */}
            <Box sx={{ display: 'flex', bgcolor: '#F1F5F9', borderRadius: '24px', p: 0.5, border: '1px solid #E2E8F0', mb: 1 }}>
              <Button
                fullWidth
                onClick={() => setLinkStyle('icon')}
                sx={{
                  borderRadius: '20px', textTransform: 'none', fontSize: '0.82rem', fontWeight: 600,
                  color: linkStyle === 'icon' ? '#1A6B8A' : '#64748B',
                  bgcolor: linkStyle === 'icon' ? '#FFFFFF' : 'transparent',
                  boxShadow: linkStyle === 'icon' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                  '&:hover': { bgcolor: linkStyle === 'icon' ? '#FFFFFF' : 'transparent' }
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
                  boxShadow: linkStyle === 'labels' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                  '&:hover': { bgcolor: linkStyle === 'labels' ? '#FFFFFF' : 'transparent' }
                }}
              >
                Display labels
              </Button>
            </Box>

            {/* Loop Form Pengisian List Link */}
            {modalData.links.map((link, index) => (
              <Box key={index} display="flex" gap={1} alignItems="center" sx={{ mb: 1, bgcolor: '#FFFFFF', p: 1.5, borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Box display="flex" flexDirection="column" gap={1} flexGrow={1}>
                  <TextField
                    size="small"
                    label="Nama Platform / Label"
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

          {/* SECTION LOCAL TIME AKTIF */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A6B8A', fontSize: '0.85rem' }}>Local time</Typography>
            <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.4, fontSize: '0.75rem', mb: 0.5 }}>
              Menampilkan "Waktu lokal" secara publik membantu orang lain memperkirakan waktu balasan pesanmu.
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
      </Dialog>

    </Box>
  );
}

export default ProfilePage;