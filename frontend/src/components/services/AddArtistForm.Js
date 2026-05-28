import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { artistService } from '../services/artistService';

const categories = [
  'Musik & Bunyi',
  'Seni Rupa',
  'Tari & Gerak',
  'Teater',
  'Fotografi',
  'Kerajinan',
  'Musik & Komedi',
  'Musik & Aktris',
  'Tari Tradisional',
  'Seni Patung'
];

const emojis = ['🐱', '🐟', '😺', '🎨', '🐾', '🎵', '🎭', '📸', '✂️', '💃', '🖌️', '🎪'];

function AddArtistForm({ onArtistAdded, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    bio: '',
    instagram: '',
    youtube: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    emoji: '🎨'
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      setError('Nama dan kategori harus diisi!');
      return;
    }

    try {
      const newArtist = artistService.add(formData);
      setSuccess(true);
      setError('');

      // Reset form
      setFormData({
        name: '',
        category: '',
        bio: '',
        instagram: '',
        youtube: '',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        emoji: '🎨'
      });

      // Notify parent
      if (onArtistAdded) onArtistAdded(newArtist);

      // Auto close after 2 seconds
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setError('Gagal menambahkan artist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ borderRadius: 4, position: 'relative', overflow: 'visible', maxWidth: 600, mx: 'auto' }}>
        {onClose && (
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom align="center" sx={{ color: '#1A6B8A' }}>
            🐱 Tambah Seniman Baru 🎨
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Masukkan data seniman yang akan ditampilkan di platform
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              🎉 Seniman berhasil ditambahkan!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nama Seniman *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Raditya Dika"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Kategori *"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Biografi"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Ceritakan tentang seniman ini..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@username"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">📷</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="YouTube"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="/channel"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">▶️</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Pilih Emoji"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleChange}
                >
                  {emojis.map((emoji) => (
                    <MenuItem key={emoji} value={emoji}>{emoji} {emoji === '🐱' ? 'Kucing' : emoji === '🐟' ? 'Ikan' : ''}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL Foto Profil"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: '50px',
                    py: 1.5,
                    background: 'linear-gradient(135deg, #1A6B8A 0%, #FFA500 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0B4A63 0%, #FF8C00 100%)',
                    }
                  }}
                >
                  ✨ Tambah Seniman ✨
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AddArtistForm;