// src/components/artist/CommissionManager.js
import React, { useState, useEffect, useRef } from 'react';
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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  LinearProgress,
  ImageList,
  ImageListItem
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
  CloudUpload as UploadIcon,
  MusicNote as MusicIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';

const COMMISSIONS_KEY = 'creartsi_artist_commissions';

// Komponen Upload Image (Reusable)
const ImageUploadField = ({ label, value, onChange, multiple = false }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      const newPreviews = [...(value || []), ...files.map(f => URL.createObjectURL(f))];
      onChange(newPreviews);
      setPreview(newPreviews);
    } else {
      const url = URL.createObjectURL(files[0]);
      onChange(url);
      setPreview(url);
    }
  };

  const handleRemove = (index) => {
    if (multiple) {
      const newPreviews = [...value];
      newPreviews.splice(index, 1);
      onChange(newPreviews);
      setPreview(newPreviews);
    } else {
      onChange('');
      setPreview('');
    }
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} color="#1A6B8A" mb={1}>{label}</Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          border: '2px dashed #CBD5E1',
          borderRadius: '12px',
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#F8FAFC',
          transition: 'all 0.2s',
          '&:hover': { borderColor: '#4A9FBF', bgcolor: '#F0F9FF' }
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple} style={{ display: 'none' }} onChange={handleFileUpload} />
        <UploadIcon sx={{ fontSize: 40, color: '#94A3B8', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">Klik untuk upload gambar</Typography>
        <Typography variant="caption" color="text.secondary">JPG, PNG, GIF, WebP</Typography>
      </Box>

      {/* Preview */}
      {value && (
        <Box mt={2}>
          {multiple ? (
            <ImageList sx={{ width: '100%', height: 'auto' }} cols={3} rowHeight={100}>
              {value.map((img, idx) => (
                <ImageListItem key={idx} sx={{ position: 'relative' }}>
                  <img src={img} alt={`preview-${idx}`} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                  <IconButton size="small" onClick={() => handleRemove(idx)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <Box position="relative" display="inline-block">
              <img src={value} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              <IconButton size="small" onClick={() => handleRemove()} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

// Komponen Upload Audio
const AudioUploadField = ({ label, value, onChange }) => {
  const inputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} color="#1A6B8A" mb={1}>{label}</Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          border: '2px dashed #CBD5E1',
          borderRadius: '12px',
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#F8FAFC',
          '&:hover': { borderColor: '#4A9FBF', bgcolor: '#F0F9FF' }
        }}
      >
        <input ref={inputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
        <MusicIcon sx={{ fontSize: 40, color: '#94A3B8', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">Klik untuk upload audio</Typography>
        <Typography variant="caption" color="text.secondary">MP3, WAV, OGG</Typography>
      </Box>
      {value && (
        <Box mt={2}>
          <audio controls src={value} style={{ width: '100%' }} />
          <IconButton size="small" onClick={() => onChange('')} sx={{ mt: 1 }}>Hapus</IconButton>
        </Box>
      )}
    </Box>
  );
};

const CommissionManager = () => {
  const [commissions, setCommissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newInclude, setNewInclude] = useState('');

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
    musicFile: '',
    hasMusic: false,
    terms: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(COMMISSIONS_KEY);
    if (saved) {
      setCommissions(JSON.parse(saved));
    }
  }, []);

  const saveCommissions = (data) => {
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
        includes: commission.includes || [],
        isOpen: commission.isOpen,
        coverImage: commission.coverImage || '',
        sampleImages: commission.sampleImages || [],
        musicFile: commission.musicFile || '',
        hasMusic: commission.hasMusic || false,
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
        musicFile: '',
        hasMusic: false,
        terms: ''
      });
    }
    setOpenDialog(true);
  };

  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setFormData({ ...formData, includes: [...formData.includes, newInclude.trim()] });
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
    if (!formData.priceFrom) {
      alert('Harga minimal wajib diisi!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let newCommissions;
      if (editingCommission) {
        newCommissions = commissions.map(c => c.id === editingCommission.id ? { ...editingCommission, ...formData, updatedAt: new Date().toISOString() } : c);
      } else {
        const newCommission = { id: Date.now(), ...formData, slotsLeft: formData.slots, createdAt: new Date().toISOString() };
        newCommissions = [...commissions, newCommission];
      }
      saveCommissions(newCommissions);
      setLoading(false);
      setOpenDialog(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus paket komisi ini?')) {
      saveCommissions(commissions.filter(c => c.id !== id));
    }
  };

  const categories = ['Illustrations', '2D Avatars', '3D Models', 'Emotes + Badges', 'Stream Assets', 'Branding + Graphics', 'Animation + Videos', 'Music + Audio'];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1A6B8A">💰 Paket Komisi</Typography>
          <Typography variant="body2" color="text.secondary">Buat paket layanan komisi dengan upload gambar sampul, contoh karya, dan audio</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ bgcolor: '#4A9FBF', borderRadius: '12px', textTransform: 'none' }}>
          + Buat Paket Komisi
        </Button>
      </Box>

      {commissions.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>Belum ada paket komisi</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Buat paket pertama Anda untuk mulai menerima pesanan</Typography>
          <Button variant="outlined" onClick={() => handleOpenDialog()} sx={{ borderColor: '#4A9FBF', color: '#4A9FBF' }}>+ Buat Paket</Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {commissions.map((comm) => (
            <Grid item xs={12} md={6} key={comm.id}>
              <Card sx={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <Box sx={{ position: 'relative', height: 180, overflow: 'hidden', bgcolor: '#E0F2FE' }}>
                  {comm.coverImage ? (
                    <img src={comm.coverImage} alt={comm.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon sx={{ fontSize: 50, color: '#4A9FBF' }} />
                    </Box>
                  )}
                  <Chip label={comm.isOpen ? 'OPEN' : 'CLOSED'} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: comm.isOpen ? '#87D37C' : '#EF4444', color: 'white', fontWeight: 700 }} />
                  {comm.sampleImages?.length > 0 && <Chip label={`📸 ${comm.sampleImages.length} gambar`} size="small" sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }} />}
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" color="#4A9FBF" fontWeight={600}>{comm.category}</Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{comm.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>{comm.description}</Typography>
                  <Typography variant="body2" color="text.secondary">Starting from</Typography>
                  <Typography variant="h5" fontWeight={800} color="#1A6B8A">Rp {comm.priceFrom?.toLocaleString('id-ID')}</Typography>
                  <Box display="flex" gap={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenDialog(comm)} sx={{ flex: 1 }}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(comm.id)}>Hapus</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* DIALOG CREATE/EDIT - PAKAI UPLOAD MEDIA */}
      <Dialog open={openDialog} onClose={() => !loading && setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #E2E8F0' }}>
          <Typography variant="h6" fontWeight={800} color="#1A6B8A">
            {editingCommission ? '✏️ Edit Paket Komisi' : '✨ Buat Paket Komisi Baru'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {loading && <LinearProgress sx={{ mb: 2 }} />}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A">📋 Informasi Dasar</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Judul Paket Komisi *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Kategori *</InputLabel>
                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} label="Kategori *">
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Deskripsi Paket" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A">💰 Harga & Estimasi</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Harga Mulai (Rp) *" type="number" value={formData.priceFrom} onChange={(e) => setFormData({ ...formData, priceFrom: parseInt(e.target.value) || '' })} InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Harga Maksimal" type="number" value={formData.priceTo} onChange={(e) => setFormData({ ...formData, priceTo: parseInt(e.target.value) || '' })} InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Estimasi Pengerjaan" value={formData.turnaround} onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })} placeholder="7-14 hari" />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Jumlah Slot" type="number" value={formData.slots} onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value) || 0 })} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Jumlah Revisi" type="number" value={formData.revisions} onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) || 0 })} />
            </Grid>

            {/* ===== MEDIA UPLOAD SECTION - BUKAN URL! ===== */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>🎨 Media Komisi (Upload Langsung)</Typography>
              <Stack spacing={3}>
                <ImageUploadField
                  label="Gambar Sampul (Upload dari perangkat)"
                  value={formData.coverImage}
                  onChange={(val) => setFormData({ ...formData, coverImage: val })}
                />

                <ImageUploadField
                  label="Gambar Contoh Karya (Upload multiple)"
                  value={formData.sampleImages}
                  onChange={(val) => setFormData({ ...formData, sampleImages: val })}
                  multiple={true}
                />

                <Box display="flex" alignItems="center" gap={2}>
                  <Switch checked={formData.hasMusic} onChange={(e) => setFormData({ ...formData, hasMusic: e.target.checked })} />
                  <Typography>🎵 Sertakan contoh audio/musik</Typography>
                </Box>

                {formData.hasMusic && (
                  <AudioUploadField
                    label="Upload File Audio"
                    value={formData.musicFile}
                    onChange={(val) => setFormData({ ...formData, musicFile: val })}
                  />
                )}
              </Stack>
            </Grid>

            {/* What's Included */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A">📦 Apa yang Didapat Pembeli?</Typography>
              <Box display="flex" gap={1} alignItems="center" mb={2}>
                <TextField size="small" placeholder="Contoh: High-res JPG/PNG" value={newInclude} onChange={(e) => setNewInclude(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddInclude()} fullWidth />
                <Button variant="outlined" onClick={handleAddInclude}>Tambah</Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.includes.map((item, idx) => <Chip key={idx} label={item} onDelete={() => handleRemoveInclude(idx)} color="primary" variant="outlined" />)}
              </Box>
            </Grid>

            {/* Terms */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A">📜 Syarat & Ketentuan</Typography>
              <TextField fullWidth multiline rows={3} value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} placeholder="Syarat dan ketentuan komisi..." />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Status Paket:</Typography>
                <Switch checked={formData.isOpen} onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })} />
                <Chip label={formData.isOpen ? '🟢 Open for commissions' : '🔴 Closed'} size="small" sx={{ bgcolor: formData.isOpen ? '#E6F5E5' : '#FEE2E2', color: formData.isOpen ? '#2E7D32' : '#DC2626' }} />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="outlined" disabled={loading}>Batal</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4A9FBF' }} disabled={loading}>
            {loading ? 'Menyimpan...' : (editingCommission ? 'Simpan Perubahan' : 'Publikasikan Paket')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionManager;