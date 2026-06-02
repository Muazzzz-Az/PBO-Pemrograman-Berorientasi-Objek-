// src/components/artist/CommissionManager.js - FIXED with event trigger
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Chip, Switch, InputAdornment, FormControl, InputLabel, Select,
  MenuItem, Stack, LinearProgress, ImageList, ImageListItem,
  Alert, Divider
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
  Close as CloseIcon, Image as ImageIcon, CloudUpload as UploadIcon,
  MusicNote as MusicIcon
} from '@mui/icons-material';
import BaseCard from './BaseCard';
import toast from 'react-hot-toast';

const COMMISSIONS_KEY = 'creartsi_artist_commissions';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
};

const compressImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

// ========== KOMPONEN UPLOAD (sama seperti sebelumnya) ==========
const ImageUploadField = ({ label, value, onChange, multiple = false }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setLoading(true);
    try {
      if (multiple) {
        const newImages = [...(value || [])];
        for (const file of files) {
          const base64 = await fileToBase64(file);
          const compressed = await compressImage(base64);
          newImages.push(compressed);
        }
        onChange(newImages);
      } else {
        const base64 = await fileToBase64(files[0]);
        const compressed = await compressImage(base64);
        onChange(compressed);
      }
    } catch (error) {
      toast.error('Failed to upload image');
    }
    setLoading(false);
  };

  const handleRemove = (index) => {
    if (multiple) {
      const newImages = [...value];
      newImages.splice(index, 1);
      onChange(newImages);
    } else {
      onChange('');
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
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#F8FAFC',
          transition: 'all 0.2s',
          opacity: loading ? 0.5 : 1,
          '&:hover': { borderColor: '#4A9FBF', bgcolor: '#F0F9FF' }
        }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple} style={{ display: 'none' }} onChange={handleFileUpload} />
        <UploadIcon sx={{ fontSize: 40, color: '#94A3B8', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </Typography>
        <Typography variant="caption" color="text.secondary">JPG, PNG, GIF, WebP</Typography>
      </Box>

      {value && (
        <Box mt={2}>
          {multiple ? (
            <ImageList cols={4} rowHeight={100} sx={{ mb: 0 }}>
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
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <img src={value} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
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

const AudioUploadField = ({ label, value, onChange }) => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (error) {
      toast.error('Failed to upload audio');
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} color="#1A6B8A" mb={1}>{label}</Typography>
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          border: '2px dashed #CBD5E1',
          borderRadius: '12px',
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#F8FAFC',
          opacity: loading ? 0.5 : 1,
          '&:hover': { borderColor: '#4A9FBF', bgcolor: '#F0F9FF' }
        }}
      >
        <input ref={inputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
        <MusicIcon sx={{ fontSize: 40, color: '#94A3B8', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Uploading...' : 'Click to upload audio'}
        </Typography>
        <Typography variant="caption" color="text.secondary">MP3, WAV, OGG</Typography>
      </Box>
      {value && (
        <Box mt={2}>
          <audio controls src={value} style={{ width: '100%' }} />
          <Button size="small" color="error" onClick={() => onChange('')} sx={{ mt: 1 }}>Remove</Button>
        </Box>
      )}
    </Box>
  );
};

// ========== MAIN KOMPONEN ==========
const CommissionManager = () => {
  const [commissions, setCommissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newInclude, setNewInclude] = useState('');

  const [formData, setFormData] = useState({
    title: '', category: '', description: '', priceFrom: '', priceTo: '',
    turnaround: '', slots: 5, revisions: 2, includes: [], isOpen: true,
    coverImage: '', sampleImages: [], musicFile: '', hasMusic: false, terms: ''
  });

  // Load commissions dari localStorage saat komponen mount
  useEffect(() => {
    const saved = localStorage.getItem(COMMISSIONS_KEY);
    if (saved) setCommissions(JSON.parse(saved));
  }, []);

  // Helper: simpan ke localStorage dan trigger event
  const saveCommissions = (data) => {
    localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(data));
    setCommissions(data);
    // 🚨 KIRIM EVENT KE SELURUH TAB
    window.dispatchEvent(new CustomEvent('commissionDataChanged'));
    console.log('✅ Commission saved, event triggered');
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
        title: '', category: '', description: '', priceFrom: '', priceTo: '',
        turnaround: '', slots: 5, revisions: 2, includes: [], isOpen: true,
        coverImage: '', sampleImages: [], musicFile: '', hasMusic: false, terms: ''
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
    setFormData({ ...formData, includes: formData.includes.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    if (!formData.title || !formData.category || !formData.priceFrom) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let newCommissions;
      if (editingCommission) {
        newCommissions = commissions.map(c =>
          c.id === editingCommission.id
            ? { ...editingCommission, ...formData, updatedAt: new Date().toISOString() }
            : c
        );
      } else {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const artistName = currentUser?.fullName || currentUser?.username || 'Artist';
        const newCommission = {
          id: Date.now(),
          ...formData,
          artistId: currentUser?.id,
          artistName: artistName,
          slotsLeft: formData.slots,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        newCommissions = [...commissions, newCommission];
      }
      saveCommissions(newCommissions);
      setLoading(false);
      setOpenDialog(false);
      toast.success(editingCommission ? 'Commission package updated successfully!' : 'Commission package published successfully!');
    }, 500);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this commission package?')) {
      const newCommissions = commissions.filter(c => c.id !== id);
      saveCommissions(newCommissions);
    }
  };

  const categories = ['Illustrations', '2D Avatars', '3D Models', 'Emotes + Badges', 'Stream Assets', 'Branding + Graphics', 'Animation + Videos', 'Music + Audio'];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1A6B8A">Commission Packages</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage your commission services</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ bgcolor: '#4A9FBF', borderRadius: '8px', textTransform: 'none' }}>
          New Package
        </Button>
      </Box>

      {commissions.length === 0 ? (
        <BaseCard sx={{ textAlign: 'center', py: 8 }}>
          <ImageIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>No commission packages</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Create your first package to start receiving orders</Typography>
          <Button variant="outlined" onClick={() => handleOpenDialog()} sx={{ borderColor: '#4A9FBF', color: '#4A9FBF', textTransform: 'none' }}>New Package</Button>
        </BaseCard>
      ) : (
        <Grid container spacing={3}>
          {commissions.map((comm) => (
            <Grid item xs={12} md={6} key={comm.id}>
              <Card sx={{ borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
                <Box sx={{ position: 'relative', height: 180, bgcolor: '#F0F9FF' }}>
                  {comm.coverImage ? (
                    <img src={comm.coverImage} alt={comm.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <ImageIcon sx={{ fontSize: 48, color: '#CBD5E1' }} />
                    </Box>
                  )}
                  <Chip label={comm.isOpen ? 'Open' : 'Closed'} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: comm.isOpen ? '#10B981' : '#EF4444', color: 'white' }} />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="caption" color="#4A9FBF" fontWeight={600}>{comm.category}</Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>{comm.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2, display: '-webkit-box', WebkitLineClamp: 2, overflow: 'hidden' }}>{comm.description}</Typography>
                  <Typography variant="h4" fontWeight={700} color="#1A6B8A" sx={{ fontSize: '1.5rem' }}>Rp {comm.priceFrom?.toLocaleString('id-ID')}</Typography>
                  <Box display="flex" gap={1} sx={{ mt: 2 }}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleOpenDialog(comm)} sx={{ flex: 1, borderRadius: '8px', textTransform: 'none' }}>Edit</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(comm.id)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog Create/Edit */}
      <Dialog open={openDialog} onClose={() => !loading && setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px', maxHeight: '90vh' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #E2E8F0', pb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#1A6B8A">{editingCommission ? 'Edit Commission Package' : 'Create Commission Package'}</Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ position: 'absolute', right: 16, top: 12 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3, overflowY: 'auto' }}>
          {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
          <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>Upload your commission package details here</Alert>

          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Basic Information</Typography>
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ flex: { xs: 1, sm: 2 } }}>
                <TextField fullWidth label="Package Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </Box>
              <Box sx={{ flex: 1, minWidth: { sm: '200px' } }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} label="Category">
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
            <TextField fullWidth label="Description" multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Pricing & Timeline</Typography>
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Starting Price (Rp)" type="number" value={formData.priceFrom} onChange={(e) => setFormData({ ...formData, priceFrom: parseInt(e.target.value) || '' })} InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }} />
              <TextField fullWidth label="Max Price (Optional)" type="number" value={formData.priceTo} onChange={(e) => setFormData({ ...formData, priceTo: parseInt(e.target.value) || '' })} InputProps={{ startAdornment: <InputAdornment position="start">Rp</InputAdornment> }} />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField fullWidth label="Turnaround Time" value={formData.turnaround} onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })} placeholder="7-14 days" />
              <TextField fullWidth label="Available Slots" type="number" value={formData.slots} onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value) || 0 })} />
              <TextField fullWidth label="Revisions Included" type="number" value={formData.revisions} onChange={(e) => setFormData({ ...formData, revisions: parseInt(e.target.value) || 0 })} />
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Media Upload</Typography>
          <Stack spacing={3} sx={{ mb: 4 }}>
            <ImageUploadField label="Cover Image" value={formData.coverImage} onChange={(val) => setFormData({ ...formData, coverImage: val })} />
            <ImageUploadField label="Sample Images (Multiple)" value={formData.sampleImages} onChange={(val) => setFormData({ ...formData, sampleImages: val })} multiple />
            <Box display="flex" alignItems="center" gap={2}>
              <Switch checked={formData.hasMusic} onChange={(e) => setFormData({ ...formData, hasMusic: e.target.checked })} />
              <Typography>Include audio sample</Typography>
            </Box>
            {formData.hasMusic && <AudioUploadField label="Audio File" value={formData.musicFile} onChange={(val) => setFormData({ ...formData, musicFile: val })} />}
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>What's Included</Typography>
          <Box display="flex" gap={1} mb={2}>
            <TextField size="small" placeholder="e.g., High-res JPG/PNG" value={newInclude} onChange={(e) => setNewInclude(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddInclude()} fullWidth />
            <Button variant="outlined" onClick={handleAddInclude}>Add</Button>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
            {formData.includes.map((item, idx) => <Chip key={idx} label={item} onDelete={() => handleRemoveInclude(idx)} variant="outlined" />)}
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={700} color="#1A6B8A" sx={{ mb: 2 }}>Terms of Service</Typography>
          <TextField fullWidth multiline rows={2} value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} placeholder="Your terms and conditions..." sx={{ mb: 4 }} />

          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Package Status:</Typography>
            <Switch checked={formData.isOpen} onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })} />
            <Chip label={formData.isOpen ? 'Open' : 'Closed'} size="small" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#4A9FBF' }} disabled={loading}>
            {loading ? 'Saving...' : (editingCommission ? 'Save Changes' : 'Publish Package')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionManager;