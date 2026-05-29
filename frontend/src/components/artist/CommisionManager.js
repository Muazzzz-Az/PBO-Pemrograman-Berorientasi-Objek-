// src/components/artist/CommissionManager.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Switch,
  InputAdornment,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';

const COMMISSIONS_KEY = 'creartsi_artist_commissions';

const CommissionManager = () => {
  const [commissions, setCommissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priceFrom: '',
    priceTo: '',
    turnaround: '',
    slots: 5,
    revisions: 2,
    includes: [],
    isOpen: true,
    coverImage: '',
    sampleImages: [],
    terms: ''
  });
  const [newInclude, setNewInclude] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(COMMISSIONS_KEY);
    if (saved) {
      setCommissions(JSON.parse(saved));
    } else {
      // Sample data seperti VGen
      const sample = [
        {
          id: 1,
          title: '"Watercolor" Portrait Illustration',
          category: 'Illustrations',
          description: 'Beautiful watercolor style portrait with soft gradients and dreamy atmosphere.',
          priceFrom: 350000,
          priceTo: 850000,
          turnaround: '7-14 days',
          slots: 5,
          slotsLeft: 4,
          revisions: 2,
          includes: ['High-res JPG/PNG', 'Source file (PSD)', 'Commercial rights'],
          isOpen: true,
          coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
          sampleImages: [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
            'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400'
          ],
          terms: 'I retain the right to post the artwork in my portfolio. Commercial use requires additional fee.'
        },
        {
          id: 2,
          title: 'Custom Chibi Emote Package',
          category: 'Emotes + Badges',
          description: 'Adorable chibi emotes perfect for Twitch, Discord, or YouTube.',
          priceFrom: 150000,
          priceTo: 600000,
          turnaround: '3-7 days',
          slots: 10,
          slotsLeft: 8,
          revisions: 3,
          includes: ['3 emotes included', 'PNG + GIF format', 'Commercial use'],
          isOpen: true,
          coverImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400',
          sampleImages: [],
          terms: 'Credit is appreciated but not required.'
        }
      ];
      setCommissions(sample);
      localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(sample));
    }
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(data));
    setCommissions(data);
  };

  const handleOpenDialog = (commission = null) => {
    if (commission) {
      setEditingCommission(commission);
      setFormData({
        title: commission.title,
        category: commission.category,
        description: commission.description,
        priceFrom: commission.priceFrom,
        priceTo: commission.priceTo,
        turnaround: commission.turnaround,
        slots: commission.slots,
        revisions: commission.revisions,
        includes: commission.includes,
        isOpen: commission.isOpen,
        coverImage: commission.coverImage,
        sampleImages: commission.sampleImages || [],
        terms: commission.terms || ''
      });
    } else {
      setEditingCommission(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        priceFrom: '',
        priceTo: '',
        turnaround: '',
        slots: 5,
        revisions: 2,
        includes: [],
        isOpen: true,
        coverImage: '',
        sampleImages: [],
        terms: ''
      });
    }
    setOpenDialog(true);
  };

  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setFormData({
        ...formData,
        includes: [...formData.includes, newInclude.trim()]
      });
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index) => {
    const newIncludes = formData.includes.filter((_, i) => i !== index);
    setFormData({ ...formData, includes: newIncludes });
  };

  const handleSave = () => {
    if (!formData.title || !formData.category) {
      alert('Judul dan kategori wajib diisi!');
      return;
    }

    let newCommissions;
    if (editingCommission) {
      newCommissions = commissions.map(c =>
        c.id === editingCommission.id
          ? { ...editingCommission, ...formData, slotsLeft: editingCommission.slotsLeft || formData.slots }
          : c
      );
    } else {
      const newCommission = {
        id: Date.now(),
        ...formData,
        slotsLeft: formData.slots,
        createdAt: new Date().toISOString()
      };
      newCommissions = [...commissions, newCommission];
    }

    saveToLocalStorage(newCommissions);
    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus paket komisi ini?')) {
      const newCommissions = commissions.filter(c => c.id !== id);
      saveToLocalStorage(newCommissions);
    }
  };

  const categories = [
    'Illustrations', '2D Avatars', '3D Models', 'Emotes + Badges',
    'Stream Assets', 'Branding + Graphics', 'Animation + Videos', 'Music + Audio'
  ];

  return (
    <Box>
      {/* Header seperti VGen */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1A6B8A">
            💰 Paket Komisi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Buat paket layanan komisi seperti di VGen. Tentukan harga, durasi, dan ketentuan.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#4A9FBF',
            borderRadius: '12px',
            textTransform: 'none',
            px: 3,
            '&:hover': { bgcolor: '#1A6B8A' }
          }}
        >
          Buat Paket Komisi
        </Button>
      </Box>

      {/* Grid Paket Komisi seperti VGen */}
      {commissions.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Belum ada paket komisi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Buat paket pertama Anda untuk mulai menerima pesanan komisi
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleOpenDialog()}
            sx={{ borderColor: '#4A9FBF', color: '#4A9FBF' }}
          >
            + Buat Paket Komisi
          </Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {commissions.map((comm) => (
            <Grid item xs={12} md={6} key={comm.id}>
              <Card sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 30px rgba(74, 159, 191, 0.15)'
                }
              }}>
                {/* Cover Image */}
                <Box sx={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={comm.coverImage || 'https://placehold.co/600x400/4A9FBF/white?text=Commission'}
                    alt={comm.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Chip
                    label={comm.isOpen ? 'OPEN' : 'CLOSED'}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      bgcolor: comm.isOpen ? '#87D37C' : '#EF4444',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  />
                  {comm.slotsLeft <= 3 && comm.slotsLeft > 0 && (
                    <Chip
                      label={`Only ${comm.slotsLeft} slots left`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: '#F59E0B',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" color="#4A9FBF" fontWeight={600}>
                    {comm.category}
                  </Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1, mt: 0.5 }}>
                    {comm.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>
                    {comm.description}
                  </Typography>

                  {/* Price */}
                  <Typography variant="body2" color="text.secondary">Starting from</Typography>
                  <Typography variant="h5" fontWeight={800} color="#1A6B8A" sx={{ mb: 2 }}>
                    Rp {(comm.priceFrom || 0).toLocaleString('id-ID')}
                    {comm.priceTo && comm.priceTo > comm.priceFrom && (
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        - Rp {comm.priceTo.toLocaleString('id-ID')}
                      </Typography>
                    )}
                  </Typography>

                  {/* Includes Badges */}
                  <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                    {comm.includes.slice(0, 3).map((item, idx) => (
                      <Chip key={idx} label={item} size="small" variant="outlined" />
                    ))}
                    {comm.includes.length > 3 && (
                      <Chip label={`+${comm.includes.length - 3} more`} size="small" variant="outlined" />
                    )}
                  </Box>

                  {/* Meta Info */}
                  <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2, color: '#64748B' }}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <ScheduleIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{comm.turnaround || '7-14 days'}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <MoneyIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">{comm.revisions} revisions</Typography>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" gap={1} sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(comm)}
                      sx={{ flex: 1, borderRadius: '10px', textTransform: 'none' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(comm.id)}
                      sx={{ borderRadius: '10px', textTransform: 'none' }}
                    >
                      Hapus
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog Create/Edit Commission - Lengkap seperti VGen */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E2E8F0',
          pb: 2
        }}>
          <Typography variant="h6" fontWeight={800} color="#1A6B8A">
            {editingCommission ? '✏️ Edit Paket Komisi' : '✨ Buat Paket Komisi Baru'}
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Basic Info */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mb={2}>
                Informasi Dasar
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Judul Paket Komisi *"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: 'Watercolor' Portrait Illustration"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Kategori *</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Kategori *"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deskripsi Paket"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan detail tentang paket komisi ini..."
              />
            </Grid>

            {/* Pricing */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>
                Harga & Estimasi
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Harga Mulai (Rp) *"
                type="number"
                value={formData.priceFrom}
                onChange={(e) => setFormData({ ...formData, priceFrom: parseInt(e.target.value) || '' })}
                InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Harga Maksimal (Opsional)"
                type="number"
                value={formData.priceTo}
                onChange={(e) => setFormData({ ...formData, priceTo: parseInt(e.target.value) || '' })}
                InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estimasi Pengerjaan"
                value={formData.turnaround}
                onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                placeholder="Contoh: 7-14 days"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Jumlah Slot"
                type="number"
                value={formData.slots}
                onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value) || 0 })}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Jumlah Revisi"
                type="number"
                value={formData.revisions}
                onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) || 0 })}
              />
            </Grid>

            {/* What's Included */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>
                Apa yang Didapat Pembeli?
              </Typography>
              <Box display="flex" gap={1} alignItems="center" mb={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Contoh: High-res JPG/PNG"
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddInclude()}
                />
                <Button variant="outlined" onClick={handleAddInclude}>
                  Tambah
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.includes.map((item, idx) => (
                  <Chip
                    key={idx}
                    label={item}
                    onDelete={() => handleRemoveInclude(idx)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Cover Image */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>
                Gambar Sampul
              </Typography>
              <TextField
                fullWidth
                label="URL Gambar Sampul"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://..."
                InputProps={{
                  startAdornment: <InputAdornment position="start"><ImageIcon /></InputAdornment>,
                }}
              />
              {formData.coverImage && (
                <Box mt={1}>
                  <img src={formData.coverImage} alt="Preview" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                </Box>
              )}
            </Grid>

            {/* Terms */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>
                Syarat & Ketentuan
              </Typography>
              <TextField
                fullWidth
                label="Terms of Service"
                multiline
                rows={3}
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="Contoh: I retain the right to post the artwork in my portfolio..."
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Status Paket:</Typography>
                <Switch
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#4A9FBF' } }}
                />
                <Chip
                  label={formData.isOpen ? '🟢 Open for commissions' : '🔴 Closed'}
                  size="small"
                  sx={{ bgcolor: formData.isOpen ? '#E6F5E5' : '#FEE2E2', color: formData.isOpen ? '#2E7D32' : '#DC2626' }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="outlined">
            Batal
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4A9FBF', '&:hover': { bgcolor: '#1A6B8A' } }}>
            {editingCommission ? 'Simpan Perubahan' : 'Publikasikan Paket'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionManager;