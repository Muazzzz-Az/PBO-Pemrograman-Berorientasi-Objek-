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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import { ImageUpload, MultiImageUpload, MusicUpload } from './BaseMediaUpload';

// ENCAPSULATION: Kelas untuk mengelola state Commission
class CommissionManagerService {
  static STORAGE_KEY = 'creartsi_artist_commissions';

  static loadCommissions() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  static saveCommissions(commissions) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(commissions));
  }

  static createCommission(data) {
    return {
      id: Date.now(),
      ...data,
      slotsLeft: data.slots,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static updateCommission(existing, newData) {
    return { ...existing, ...newData, updatedAt: new Date().toISOString() };
  }
}

// CommissionCard Component (Abstraction)
const CommissionCard = ({ commission, onEdit, onDelete }) => {
  return (
    <Card sx={{
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(74, 159, 191, 0.15)' }
    }}>
      <Box sx={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        {commission.coverImage ? (
          <img src={commission.coverImage} alt={commission.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Box sx={{ width: '100%', height: '100%', bgcolor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon sx={{ fontSize: 50, color: '#4A9FBF' }} />
          </Box>
        )}
        <Chip
          label={commission.isOpen ? 'OPEN' : 'CLOSED'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: commission.isOpen ? '#87D37C' : '#EF4444',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.75rem'
          }}
        />
        {commission.hasMusic && (
          <Chip label="🎵 Includes Audio" size="small" sx={{ position: 'absolute', bottom: 12, left: 12, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }} />
        )}
        {commission.sampleImages?.length > 0 && (
          <Chip label={`📸 ${commission.sampleImages.length} images`} size="small" sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }} />
        )}
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography variant="caption" color="#4A9FBF" fontWeight={600}>{commission.category}</Typography>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 1, mt: 0.5 }}>{commission.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>{commission.description}</Typography>

        <Typography variant="body2" color="text.secondary">Starting from</Typography>
        <Typography variant="h5" fontWeight={800} color="#1A6B8A" sx={{ mb: 2 }}>
          Rp {commission.priceFrom?.toLocaleString('id-ID') || 0}
          {commission.priceTo && commission.priceTo > commission.priceFrom && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>- Rp {commission.priceTo.toLocaleString('id-ID')}</Typography>
          )}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          {commission.includes?.slice(0, 3).map((item, idx) => <Chip key={idx} label={item} size="small" variant="outlined" />)}
          {commission.includes?.length > 3 && <Chip label={`+${commission.includes.length - 3}`} size="small" variant="outlined" />}
        </Box>

        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2, color: '#64748B' }}>
          <Box display="flex" alignItems="center" gap={0.5}><ScheduleIcon sx={{ fontSize: 16 }} /><Typography variant="caption">{commission.turnaround || '7-14 days'}</Typography></Box>
          <Box display="flex" alignItems="center" gap={0.5}><MoneyIcon sx={{ fontSize: 16 }} /><Typography variant="caption">{commission.revisions} revisi</Typography></Box>
        </Box>

        <Box display="flex" gap={1} sx={{ mt: 2 }}>
          <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => onEdit(commission)} sx={{ flex: 1, borderRadius: '10px', textTransform: 'none' }}>Edit</Button>
          <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(commission.id)} sx={{ borderRadius: '10px', textTransform: 'none' }}>Hapus</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// MAIN COMPONENT
const CommissionManager = () => {
  const [commissions, setCommissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [loading, setLoading] = useState(false);

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
  const [newInclude, setNewInclude] = useState('');

  useEffect(() => {
    const loaded = CommissionManagerService.loadCommissions();
    setCommissions(loaded);
  }, []);

  const saveCommissions = (data) => {
    CommissionManagerService.saveCommissions(data);
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
        const updated = CommissionManagerService.updateCommission(editingCommission, formData);
        newCommissions = commissions.map(c => c.id === editingCommission.id ? updated : c);
      } else {
        const newCommission = CommissionManagerService.createCommission(formData);
        newCommissions = [...commissions, newCommission];
      }
      saveCommissions(newCommissions);
      setLoading(false);
      setOpenDialog(false);
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus paket komisi ini?')) {
      const newCommissions = commissions.filter(c => c.id !== id);
      saveCommissions(newCommissions);
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ bgcolor: '#4A9FBF', borderRadius: '12px', textTransform: 'none', px: 3 }}>
          + Buat Paket Komisi
        </Button>
      </Box>

      {commissions.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>Belum ada paket komisi</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Buat paket pertama Anda untuk mulai menerima pesanan komisi</Typography>
          <Button variant="outlined" onClick={() => handleOpenDialog()} sx={{ borderColor: '#4A9FBF', color: '#4A9FBF' }}>+ Buat Paket Komisi</Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {commissions.map((comm) => (
            <Grid item xs={12} md={6} key={comm.id}>
              <CommissionCard commission={comm} onEdit={handleOpenDialog} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* DIALOG CREATE/EDIT - MENGGUNAKAN UPLOAD MEDIA BUKAN URL */}
      <Dialog open={openDialog} onClose={() => !loading && setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', pb: 2 }}>
          <Typography variant="h6" fontWeight={800} color="#1A6B8A">
            {editingCommission ? '✏️ Edit Paket Komisi' : '✨ Buat Paket Komisi Baru'}
          </Typography>
          <IconButton onClick={() => !loading && setOpenDialog(false)} disabled={loading}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

          <Grid container spacing={3}>
            {/* Informasi Dasar */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mb={2}>📋 Informasi Dasar</Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Judul Paket Komisi *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: 'Watercolor' Portrait Illustration" disabled={loading} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Kategori *</InputLabel>
                <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} label="Kategori *">
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Deskripsi Paket" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Jelaskan detail tentang paket komisi ini..." disabled={loading} />
            </Grid>

            {/* Harga & Estimasi */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>💰 Harga & Estimasi</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Harga Mulai (Rp) *" type="number" value={formData.priceFrom} onChange={(e) => setFormData({ ...formData, priceFrom: parseInt(e.target.value) || '' })} InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }} disabled={loading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Harga Maksimal (Opsional)" type="number" value={formData.priceTo} onChange={(e) => setFormData({ ...formData, priceTo: parseInt(e.target.value) || '' })} InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }} disabled={loading} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Estimasi Pengerjaan" value={formData.turnaround} onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })} placeholder="Contoh: 7-14 days" disabled={loading} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Jumlah Slot" type="number" value={formData.slots} onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value) || 0 })} disabled={loading} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Jumlah Revisi" type="number" value={formData.revisions} onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) || 0 })} disabled={loading} />
            </Grid>

            {/* MEDIA UPLOAD - BUKAN URL TEXT FIELD! */}
            <Grid item xs={12}>
              <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid #E2E8F0', borderRadius: '12px !important' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={700} color="#1A6B8A">🎨 Media & Portofolio (Upload Gambar/Audio)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3}>
                    {/* UPLOAD GAMBAR SAMPUL - BUKAN URL */}
                    <ImageUpload
                      label="Gambar Sampul (Upload dari perangkat)"
                      value={formData.coverImage}
                      onChange={(val) => setFormData({ ...formData, coverImage: val })}
                    />

                    {/* UPLOAD MULTIPLE GAMBAR CONTOH - BUKAN URL */}
                    <MultiImageUpload
                      label="Gambar Contoh Karya (Upload multiple gambar)"
                      value={formData.sampleImages}
                      onChange={(val) => setFormData({ ...formData, sampleImages: val })}
                    />

                    {/* OPSI UPLOAD AUDIO */}
                    <Box display="flex" alignItems="center" gap={2}>
                      <Switch checked={formData.hasMusic} onChange={(e) => setFormData({ ...formData, hasMusic: e.target.checked })} disabled={loading} />
                      <Typography>🎵 Sertakan contoh audio/musik (MP3, WAV, OGG)</Typography>
                    </Box>

                    {formData.hasMusic && (
                      <MusicUpload
                        label="Upload Contoh Audio"
                        value={formData.musicFile}
                        onChange={(val) => setFormData({ ...formData, musicFile: val })}
                      />
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* What's Included */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>📦 Apa yang Didapat Pembeli?</Typography>
              <Box display="flex" gap={1} alignItems="center" mb={2}>
                <TextField fullWidth size="small" placeholder="Contoh: High-res JPG/PNG" value={newInclude} onChange={(e) => setNewInclude(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddInclude()} disabled={loading} />
                <Button variant="outlined" onClick={handleAddInclude} disabled={loading}>Tambah</Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formData.includes.map((item, idx) => (
                  <Chip key={idx} label={item} onDelete={() => handleRemoveInclude(idx)} color="primary" variant="outlined" disabled={loading} />
                ))}
              </Box>
            </Grid>

            {/* Syarat & Ketentuan */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" mt={1} mb={2}>📜 Syarat & Ketentuan</Typography>
              <TextField fullWidth label="Terms of Service" multiline rows={3} value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} placeholder="Contoh: I retain the right to post the artwork in my portfolio..." disabled={loading} />
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Status Paket:</Typography>
                <Switch checked={formData.isOpen} onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })} disabled={loading} />
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